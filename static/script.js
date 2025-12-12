// Euler Brick Checker JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize visualization
    initializeVisualization();

    // Update visualization if we have results
    const resultData = document.querySelector('[data-result]');
    if (resultData) {
        const result = resultData.dataset.result === 'true';
        const triple1 = resultData.dataset.triple1;
        const triple2 = resultData.dataset.triple2;
        updateVisualization(result, triple1, triple2);
    }

    // Get input elements and result container
    const triple1Input = document.getElementById('triple1');
    const triple2Input = document.getElementById('triple2');
    const tripleInputs = [triple1Input, triple2Input];

    // Auto-format input fields and validate in real-time
    tripleInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove any non-numeric characters except commas, spaces, parentheses, brackets
            let value = e.target.value.replace(/[^0-9,\s\(\)\[\]]/g, '');

            // Auto-add commas if user types spaces or other separators
            value = value.replace(/\s+/g, ',');
            value = value.replace(/[\(\)\[\]]/g, '');

            e.target.value = value;

            // Trigger real-time validation
            validateAndCheck();
        });

        // Add placeholder examples when focused
        input.addEventListener('focus', function() {
            if (!this.value) {
                this.placeholder = this.id === 'triple1' ? '44,117,125' : '117,240,267';
            }
        });

        input.addEventListener('blur', function() {
            this.placeholder = this.id === 'triple1'
                ? 'e.g., 44,117,125 or (44,117,125)'
                : 'e.g., 117,240,267 or (117,240,267)';
        });
    });

    // Prevent form submission
    const form = document.querySelector('.checker-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateAndCheck();
    });

    // Pre-fill with example on page load (optional)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('example') === 'true') {
        document.getElementById('triple1').value = '44,117,125';
        document.getElementById('triple2').value = '117,240,267';
        validateAndCheck();
    }
});

// Parse triple input
function parseTriple(inputStr) {
    if (!inputStr || !inputStr.trim()) return null;

    const cleaned = inputStr.replace(/[\(\)\[\]\s]/g, '');
    const parts = cleaned.split(',').filter(p => p.length > 0);

    if (parts.length !== 3) return null;

    try {
        const triple = parts.map(x => parseInt(x.trim()));
        if (triple.some(x => isNaN(x) || x <= 0)) return null;
        return triple;
    } catch {
        return null;
    }
}

// Check if triple is a valid Pythagorean triple
function isValidPythagorean(triple) {
    if (!triple || triple.length !== 3) return false;
    const [a, b, c] = triple.sort((x, y) => x - y);
    return a*a + b*b === c*c;
}

// Check if two triples form an Euler Brick
function checkEulerBrick(triple1, triple2) {
    // Convert to sets for intersection
    const set1 = new Set(triple1);
    const set2 = new Set(triple2);

    // Find common elements
    const common = [...set1].filter(x => set2.has(x));

    // Must have exactly one common element
    if (common.length !== 1) return false;

    const sharedDim = common[0];

    // Find hypotenuse for each triple
    function findHypotenuse(triple) {
        const [a, b, c] = triple;
        if (a*a + b*b === c*c) return c;
        if (a*a + c*c === b*b) return b;
        if (b*b + c*c === a*a) return a;
        return null;
    }

    const hyp1 = findHypotenuse(triple1);
    const hyp2 = findHypotenuse(triple2);

    if (!hyp1 || !hyp2) return false;

    // Shared dimension should NOT be the hypotenuse
    if (sharedDim === hyp1 || sharedDim === hyp2) return false;

    return true;
}

// Real-time validation and checking
function validateAndCheck() {
    const triple1Input = document.getElementById('triple1');
    const triple2Input = document.getElementById('triple2');

    const triple1Str = triple1Input.value;
    const triple2Str = triple2Input.value;

    // Parse inputs
    const triple1 = parseTriple(triple1Str);
    const triple2 = parseTriple(triple2Str);

    // Clear previous results
    let resultSection = document.querySelector('.result-section');
    let messagesDiv = document.querySelector('.messages');

    // Validate first triple
    if (triple1Str.trim()) {
        if (!triple1) {
            showValidationFeedback(triple1Input, false);
            showMessage('Invalid format for first triple', 'error');
            clearResult();
            showPlaceholder(document.querySelector('.graph-svg'));
            return;
        } else if (!isValidPythagorean(triple1)) {
            showValidationFeedback(triple1Input, false);
            showMessage('First triple is not a valid Pythagorean triple', 'error');
            clearResult();
            showPlaceholder(document.querySelector('.graph-svg'));
            return;
        } else {
            showValidationFeedback(triple1Input, true);
        }
    } else {
        triple1Input.classList.remove('valid', 'invalid');
        clearResult();
        clearMessages();
        showPlaceholder(document.querySelector('.graph-svg'));
        return;
    }

    // Validate second triple
    if (triple2Str.trim()) {
        if (!triple2) {
            showValidationFeedback(triple2Input, false);
            showMessage('Invalid format for second triple', 'error');
            clearResult();
            showPlaceholder(document.querySelector('.graph-svg'));
            return;
        } else if (!isValidPythagorean(triple2)) {
            showValidationFeedback(triple2Input, false);
            showMessage('Second triple is not a valid Pythagorean triple', 'error');
            clearResult();
            showPlaceholder(document.querySelector('.graph-svg'));
            return;
        } else {
            showValidationFeedback(triple2Input, true);
        }
    } else {
        triple2Input.classList.remove('valid', 'invalid');
        clearResult();
        clearMessages();
        return;
    }

    // Both triples are valid, check if they're the same
    if (JSON.stringify(triple1.sort()) === JSON.stringify(triple2.sort())) {
        showMessage('Please enter two different triples', 'error');
        clearResult();
        return;
    }

    // Check if they form an Euler Brick
    clearMessages();
    const result = checkEulerBrick(triple1, triple2);
    showResult(result, triple1Str, triple2Str, triple1, triple2);
    visualizeEulerBrick(triple1, triple2, result);
}

// Show validation feedback
function showValidationFeedback(input, isValid) {
    input.classList.remove('valid', 'invalid');
    if (input.value.trim()) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
}

// Show message
function showMessage(message, type) {
    clearMessages();
    const messagesDiv = document.createElement('div');
    messagesDiv.className = 'messages';
    messagesDiv.innerHTML = `<div class="message ${type}">${message}</div>`;

    const form = document.querySelector('.checker-form');
    form.parentNode.insertBefore(messagesDiv, form.nextSibling);
}

// Clear messages
function clearMessages() {
    const messagesDiv = document.querySelector('.messages');
    if (messagesDiv) messagesDiv.remove();
}

// Clear result
function clearResult() {
    const resultSection = document.querySelector('.result-section');
    if (resultSection) resultSection.remove();
}

// Show result
function showResult(result, triple1Str, triple2Str, triple1, triple2) {
    clearResult();

    const resultSection = document.createElement('div');
    resultSection.className = 'result-section';

    const resultClass = result ? 'success' : 'failure';
    const icon = result ? '✓' : '✗';
    const iconClass = result ? 'success-icon' : 'failure-icon';
    const message = result
        ? 'These triples <strong>DO</strong> form two faces of an Euler Brick!'
        : 'These triples do <strong>NOT</strong> form two faces of an Euler Brick.';

    resultSection.innerHTML = `
        <div class="result-card ${resultClass}">
            <h3>Result</h3>
            <div class="result-display">
                <div class="${iconClass}">${icon}</div>
                <p class="result-text">${message}</p>
            </div>
            <div class="triple-display">
                <span class="triple">${triple1Str}</span>
                <span class="connector">and</span>
                <span class="triple">${triple2Str}</span>
            </div>
        </div>
    `;

    const rightPanel = document.querySelector('.right-panel');
    rightPanel.appendChild(resultSection);
}

// Add CSS classes for validation states
const style = document.createElement('style');
style.textContent = `
    .input-group input.valid {
        border-color: #68d391;
        box-shadow: 0 0 0 3px rgba(104, 211, 145, 0.1);
    }

    .input-group input.invalid {
        border-color: #fc8181;
        box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.1);
    }

    .check-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Visualization functions
function initializeVisualization() {
    // Check if we have result data and update visualization
    const resultData = document.querySelector('[data-result]');
    if (resultData && resultData.dataset.result) {
        const result = resultData.dataset.result === 'true';
        const triple1 = resultData.dataset.triple1;
        const triple2 = resultData.dataset.triple2;
        updateVisualization(result, triple1, triple2);
    }
    // Otherwise, the SVG placeholder is already in the HTML
}

function showPlaceholder(svg) {
    svg.innerHTML = `
        <circle cx="300" cy="150" r="60" fill="rgba(102, 126, 234, 0.1)" stroke="#667eea" stroke-width="2"/>
        <text x="300" y="160" class="dimension-label" text-anchor="middle" font-size="16">📐</text>
        <text x="300" y="200" class="dimension-label" text-anchor="middle" font-size="14" fill="#718096">
            Enter two Pythagorean triples
        </text>
        <text x="300" y="220" class="dimension-label" text-anchor="middle" font-size="14" fill="#718096">
            to visualize the Euler Brick
        </text>
    `;
}

function visualizeEulerBrick(triple1, triple2, isValid) {
    const svg = document.querySelector('.graph-svg');
    if (!svg) return;

    if (!isValid) {
        showInvalidVisualization(svg, triple1, triple2);
        return;
    }

    // Find shared dimension and reconstruct brick
    const sharedDim = findSharedDimension(triple1, triple2);
    const brick = reconstructBrick(triple1, triple2, sharedDim);

    if (brick) {
        drawValidEulerBrick(svg, triple1, triple2, brick, sharedDim);
    } else {
        showInvalidVisualization(svg, triple1, triple2);
    }
}

function findSharedDimension(triple1, triple2) {
    const set1 = new Set(triple1);
    const set2 = new Set(triple2);
    const common = [...set1].filter(x => set2.has(x));
    return common.length === 1 ? common[0] : null;
}

function reconstructBrick(triple1, triple2, sharedDim) {
    // Find which elements are legs vs hypotenuse for each triple
    const legs1 = findLegs(triple1);
    const legs2 = findLegs(triple2);

    if (!legs1 || !legs2) return null;

    // The shared dimension should be a leg in both triples
    if (!legs1.includes(sharedDim) || !legs2.includes(sharedDim)) return null;

    // Extract the three dimensions
    const dim1 = legs1.find(x => x !== sharedDim);
    const dim2 = sharedDim;
    const dim3 = legs2.find(x => x !== sharedDim);

    return { a: dim1, b: dim2, c: dim3 };
}

function findLegs(triple) {
    const [x, y, z] = triple;
    // Check all combinations to find which two form the legs
    if (x*x + y*y === z*z) return [x, y];
    if (x*x + z*z === y*y) return [x, z];
    if (y*y + z*z === x*x) return [y, z];
    return null;
}

function drawValidEulerBrick(svg, triple1, triple2, brick, sharedDim) {
    svg.innerHTML = '';

    const { a, b, c } = brick;
    const centerX = 300;
    const centerY = 200;

    // Draw the two faces side by side
    const face1X = centerX - 150;
    const face2X = centerX + 50;
    const faceY = centerY - 60;

    // Scale factors for visualization
    const scale = Math.min(100 / Math.max(a, b), 80 / Math.max(b, c));
    const w1 = a * scale;
    const h1 = b * scale;
    const w2 = b * scale;
    const h2 = c * scale;

    // Face 1 (a × b)
    svg.innerHTML += `
        <rect x="${face1X}" y="${faceY}" width="${w1}" height="${h1}"
              class="face" rx="4"/>
        <line x1="${face1X}" y1="${faceY}" x2="${face1X + w1}" y2="${faceY + h1}"
              class="diagonal"/>
        <text x="${face1X + w1/2}" y="${faceY - 10}" class="dimension-label">${a}×${b}</text>
    `;

    // Face 2 (b × c)
    svg.innerHTML += `
        <rect x="${face2X}" y="${faceY}" width="${w2}" height="${h2}"
              class="face" rx="4"/>
        <line x1="${face2X}" y1="${faceY}" x2="${face2X + w2}" y2="${faceY + h2}"
              class="diagonal"/>
        <text x="${face2X + w2/2}" y="${faceY - 10}" class="dimension-label">${b}×${c}</text>
    `;

    // Highlight shared edge (dimension b)
    const sharedY = faceY + h1;
    svg.innerHTML += `
        <line x1="${face1X}" y1="${sharedY}" x2="${face2X}" y2="${sharedY}"
              class="shared-edge"/>
        <text x="${(face1X + face2X)/2}" y="${sharedY + 20}" class="dimension-label"
              fill="#e53e3e">${b} (shared edge)</text>
    `;

    // Draw 3D brick representation
    const brick3dX = centerX - 100;
    const brick3dY = centerY + 80;
    const depth = 40;

    svg.innerHTML += `
        <!-- Front face -->
        <rect x="${brick3dX}" y="${brick3dY}" width="${a * scale * 0.6}" height="${b * scale * 0.6}"
              class="brick-3d" rx="2"/>
        <!-- Side face -->
        <polygon points="${brick3dX + a * scale * 0.6},${brick3dY}
                        ${brick3dX + a * scale * 0.6 + depth},${brick3dY - depth/2}
                        ${brick3dX + a * scale * 0.6 + depth},${brick3dY + c * scale * 0.6 - depth/2}
                        ${brick3dX + a * scale * 0.6},${brick3dY + c * scale * 0.6}"
              class="brick-3d"/>
        <!-- Top face -->
        <polygon points="${brick3dX},${brick3dY}
                        ${brick3dX + depth},${brick3dY - depth/2}
                        ${brick3dX + a * scale * 0.6 + depth},${brick3dY - depth/2}
                        ${brick3dX + a * scale * 0.6},${brick3dY}"
              class="brick-3d"/>
    `;

    // Add dimensions text
    svg.innerHTML += `
        <text x="${centerX}" y="${brick3dY + c * scale * 0.6 + 40}" class="dimension-label"
              font-size="16" font-weight="600">Euler Brick: ${a} × ${b} × ${c}</text>
    `;
}

function showInvalidVisualization(svg, triple1, triple2) {
    svg.innerHTML = `
        <circle cx="200" cy="150" r="40" fill="rgba(252, 129, 129, 0.2)" stroke="#fc8181" stroke-width="2"/>
        <circle cx="400" cy="150" r="40" fill="rgba(252, 129, 129, 0.2)" stroke="#fc8181" stroke-width="2"/>
        <line x1="240" y1="150" x2="360" y2="150" stroke="#fc8181" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="300" y="200" class="dimension-label" text-anchor="middle" font-size="14" fill="#c53030">
            Triples do not form Euler Brick
        </text>
        <text x="200" y="130" class="dimension-label" text-anchor="middle">${triple1.join(',')}</text>
        <text x="400" y="130" class="dimension-label" text-anchor="middle">${triple2.join(',')}</text>
        <text x="300" y="170" class="dimension-label" text-anchor="middle" fill="#c53030">✗</text>
    `;
}

// Update visualization when form is submitted
function updateVisualization(result, triple1, triple2) {
    if (typeof result === 'boolean') {
        const t1 = triple1 ? triple1.split(',').map(x => parseInt(x.trim())) : null;
        const t2 = triple2 ? triple2.split(',').map(x => parseInt(x.trim())) : null;

        if (t1 && t2 && t1.length === 3 && t2.length === 3) {
            visualizeEulerBrick(t1, t2, result);
        }
    }
}
