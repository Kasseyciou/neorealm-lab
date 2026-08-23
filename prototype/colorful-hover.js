(function setupNeoRealmColorfulHover(global) {
  const finePointer = global.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)');

  const vertexShader = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // A compact per-image adaptation of the MIT-licensed Codrops colorful hover idea:
  // https://github.com/akella/webgl-mouseover-effects
  const fragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uTextureSize;
    uniform vec2 uPointer;
    uniform float uVelocity;
    uniform float uContain;
    uniform float uZoom;
    varying vec2 vUv;

    vec2 fittedUv(vec2 uv) {
      float canvasAspect = uResolution.x / uResolution.y;
      float imageAspect = uTextureSize.x / uTextureSize.y;
      vec2 result = uv;
      if (uContain > 0.5) {
        if (canvasAspect > imageAspect) result.x = (uv.x - 0.5) * canvasAspect / imageAspect + 0.5;
        else result.y = (uv.y - 0.5) * imageAspect / canvasAspect + 0.5;
      } else {
        if (canvasAspect > imageAspect) result.y = (uv.y - 0.5) * canvasAspect / imageAspect + 0.5;
        else result.x = (uv.x - 0.5) * imageAspect / canvasAspect + 0.5;
      }
      return (result - 0.5) / uZoom + 0.5;
    }

    vec4 sampleImage(vec2 uv) {
      vec2 fitted = fittedUv(uv);
      if (fitted.x < 0.0 || fitted.x > 1.0 || fitted.y < 0.0 || fitted.y > 1.0) return vec4(0.0667, 0.0667, 0.0588, 1.0);
      return texture2D(uTexture, fitted);
    }

    void main() {
      vec2 centered = vUv - uPointer;
      centered.x *= uResolution.x / uResolution.y;
      float influence = smoothstep(0.46, 0.015, length(centered));
      vec2 direction = normalize(vec2(centered.x * uResolution.y / uResolution.x, centered.y) + vec2(0.0001));
      vec2 offset = direction * influence * uVelocity * 0.026;
      vec4 base = sampleImage(vUv);
      float red = sampleImage(vUv + offset * 1.7).r;
      float green = sampleImage(vUv + offset * 0.55).g;
      float blue = sampleImage(vUv - offset * 1.25).b;
      gl_FragColor = vec4(red, green, blue, base.a);
    }
  `;

  const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.warn('NeoRealm colorful hover shader failed to compile.', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  };

  const createProgram = (gl) => {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    console.warn('NeoRealm colorful hover shader failed to link.', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  };

  const eligible = () => finePointer.matches && !reducedMotion.matches && global.innerWidth > 720;

  const attach = (card) => {
    const image = card.querySelector('.waterfall-image img, :scope > img');
    if (!image) return;
    const host = image.closest('.waterfall-image') || card;
    const contain = Boolean(image.closest('.waterfall-image.ig-post'));
    const zoom = 1;
    let canvas;
    let gl;
    let program;
    let vertexBuffer;
    let texture;
    let resizeObserver;
    let frame = 0;
    let disposeTimer = 0;
    let isInside = false;
    let isReady = false;
    let previousPointer = { x: 0, y: 0, time: 0 };
    let pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let velocity = 0;
    let targetVelocity = 0;

    const stopFrame = () => {
      if (!frame) return;
      global.cancelAnimationFrame(frame);
      frame = 0;
    };

    const dispose = () => {
      stopFrame();
      global.clearTimeout(disposeTimer);
      resizeObserver?.disconnect();
      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
        if (program) gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      canvas?.remove();
      canvas = null;
      gl = null;
      program = null;
      texture = null;
      vertexBuffer = null;
      resizeObserver = null;
      isReady = false;
    };

    const resize = () => {
      if (!gl || !canvas) return;
      const rect = host.getBoundingClientRect();
      const pixelRatio = Math.min(global.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      frame = 0;
      if (!gl || !program || !canvas) return;
      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;
      velocity += (targetVelocity - velocity) * 0.16;
      targetVelocity *= isInside ? 0.84 : 0.68;

      gl.useProgram(program);
      const location = (name) => gl.getUniformLocation(program, name);
      gl.uniform2f(location('uResolution'), canvas.width, canvas.height);
      gl.uniform2f(location('uTextureSize'), image.naturalWidth || image.width, image.naturalHeight || image.height);
      gl.uniform2f(location('uPointer'), pointer.x, 1 - pointer.y);
      gl.uniform1f(location('uVelocity'), velocity);
      gl.uniform1f(location('uContain'), contain ? 1 : 0);
      gl.uniform1f(location('uZoom'), zoom);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(location('uTexture'), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (isInside || velocity > 0.0008 || Math.abs(pointer.targetX - pointer.x) > 0.001 || Math.abs(pointer.targetY - pointer.y) > 0.001) {
        frame = global.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!frame && isReady) frame = global.requestAnimationFrame(render);
    };

    const initialize = () => {
      if (isReady || !eligible() || !image.complete || !image.naturalWidth) return;
      canvas = document.createElement('canvas');
      canvas.className = `colorful-hover-canvas${host === card ? ' colorful-hover-canvas-archive' : ''}`;
      canvas.setAttribute('aria-hidden', 'true');
      host.append(canvas);
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
      if (!gl) {
        canvas.remove();
        canvas = null;
        return;
      }
      program = createProgram(gl);
      if (!program) {
        dispose();
        return;
      }
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
      isReady = true;
      render();
      canvas.classList.add('is-ready');
    };

    card.addEventListener('pointerenter', () => {
      if (!eligible()) return;
      global.clearTimeout(disposeTimer);
      isInside = true;
      initialize();
      if (!isReady) return;
      canvas.classList.add('is-active');
      requestRender();
    });

    card.addEventListener('pointermove', (event) => {
      if (!eligible()) return;
      initialize();
      if (!isReady) return;
      const rect = host.getBoundingClientRect();
      const now = event.timeStamp || performance.now();
      const localX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const localY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      const elapsed = Math.max(12, now - (previousPointer.time || now - 16));
      const distance = Math.hypot(localX - previousPointer.x, localY - previousPointer.y);
      pointer.targetX = localX / rect.width;
      pointer.targetY = localY / rect.height;
      targetVelocity = Math.min(1, distance / elapsed / 1.7);
      previousPointer = { x: localX, y: localY, time: now };
      canvas.classList.add('is-active');
      requestRender();
    });

    card.addEventListener('pointerleave', () => {
      isInside = false;
      previousPointer.time = 0;
      canvas?.classList.remove('is-active');
      requestRender();
      global.clearTimeout(disposeTimer);
      disposeTimer = global.setTimeout(() => {
        if (!isInside) dispose();
      }, 760);
    });

    image.addEventListener('load', () => {
      if (isInside) initialize();
    }, { once: true });
  };

  const setup = () => {
    if (!finePointer.matches || reducedMotion.matches) return;
    document.querySelectorAll('[data-trail-card]').forEach(attach);
  };

  global.NeoRealmColorfulHover = { setup };
}(window));
