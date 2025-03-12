uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;

uniform vec2 uMouse;       // Mouse position in normalized screen space (-1 to 1)
uniform vec2 uFrequency;    // Wave frequency for X and Y axes
uniform float uTime;        // Time variable for animation

attribute vec3 position;    // Vertex position in model space
attribute vec2 uv;          // Texture coordinate (optional)

varying vec2 vUv;           // Pass UV to fragment shader (optional)

void main() {
    vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

    // Calculate the distance between the mouse position and the vertex position (in screen space)
    float dist = distance(uMouse, uv);  // Using UV as pixel-like coordinates

    // Apply wave effect only to vertices close to the cursor
    float elevation = 0.0;
    // Apply wave effect only for vertices within a certain distance
    if (dist < 0.1) {  // Only animate vertices near the cursor (change 0.2 for radius control)
        elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
        elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

        // Apply the calculated elevation to the Z position
        modelPosition.z += elevation;
    }

    // Set the final vertex position
    gl_Position = projectionMatrix * modelPosition;

    // Pass UV to fragment shader if needed
    vUv = uv;
}
