import { useEffect, useRef } from 'react';
import textUrl from '/src/rendered_lorem_ipsum.png';

export const MAX_IOR = 2;
// dont touch ts pls
const VS = `#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;uniform vec2 uRes;uniform float uN,uD,uKn;
out vec4 o;
const float A=0.45,R=0.7,T=0.2;
void main(){
  vec2 p=gl_FragCoord.xy/uRes.y;
  vec2 c=vec2(p.x<1.0?0.5:1.5,0.5);
  bool hyp=p.x>=1.0;
  vec2 q=p-c;float r=length(q);
  vec2 s=p;bool tir=false;float edge=0.0;
  if(r<A){
    float f,fp;
    if(!hyp){float w=sqrt(R*R-r*r);f=T-(R-w);fp=-r/w;}
    else{float k=-uKn*uKn,cc=1.0/R;float w=sqrt(1.0-(1.0+k)*cc*cc*r*r);f=T-cc*r*r/(1.0+w);fp=-cc*r/w;}
    vec2 dr=r>1e-5?q/r:vec2(0.);
    vec3 N=normalize(vec3(-fp*dr,1.0));
    vec3 t1=refract(vec3(0,0,-1),N,1.0/uN);
    vec2 x1=q+t1.xy*(f/-t1.z);
    vec3 t2=refract(t1,vec3(0,0,1),uN);
    if(dot(t2,t2)<0.5)tir=true;
    else s=c+x1+t2.xy*(uD/-t2.z);
    edge=smoothstep(A-0.007,A,r);
  }
  vec3 col=tir?vec3(0.2):texture(uTex,vec2(s.x/2.0,1.0-s.y)).rgb;
  o=vec4(mix(col,vec3(0.3,0.4,0.55),edge*0.8),1.0);
}`;

export default function RefractionSim({ n, d, retune }) {
  const cv = useRef(null);
  const gs = useRef(null);
  const vals = useRef({ n, d, retune });
  vals.current = { n, d, retune };

  const draw = () => {
    const g = gs.current, c = cv.current;
    if (!g || !c) return;
    const { gl, U } = g, v = vals.current;
    const w = Math.round(c.clientWidth * Math.min(window.devicePixelRatio || 1, 2));
    if (c.width !== w) { c.width = w; c.height = Math.round(w / 2); }
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2f(U('uRes'), c.width, c.height);
    gl.uniform1f(U('uN'), v.n);
    gl.uniform1f(U('uD'), v.d);
    gl.uniform1f(U('uKn'), v.retune ? v.n : 1.5);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  useEffect(() => {
    const gl = cv.current.getContext('webgl2');
    if (!gl) return;
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const al = gl.getAttribLocation(pr, 'a');
    gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    gs.current = { gl, U: (name) => gl.getUniformLocation(pr, name) };
    const tex = gl.createTexture(), im = new Image();
    im.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gs.current.U('uTex'), 0);
      draw();
    };
    im.src = textUrl;
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  useEffect(draw, [n, d, retune]);

  return (
    <div className="sim">
      <canvas ref={cv} />
      <span className="sim-tag">Spherical</span>
      <span className="sim-tag right">Hyperbolic</span>
    </div>
  );
}
