 varying vec2 vUv;
 uniform sampler2D uTexture;
//  uniform float uBloomStrength;

    void main() {
        vec4 color = texture2D(uTexture, vUv);
        // gl_FragColor = vec4(vUv,0.,1.);
        gl_FragColor = color; 
        if(color.r<0.1 && color.g <0.1 && color.b<0.1)
        discard;// Simple gradient
        
    }