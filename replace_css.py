import sys

filepath = 'assets/css/shared.css'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
.share-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 0.95em;
    color: var(--text-color, #1a202c);
}

body.dark .share-checkbox {
    color: #e2e8f0;
}

.share-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}
"""

replace_block = """
.share-option {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--grid-border, #e2e8f0);
}

.share-option:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

body.dark .share-option {
    border-bottom-color: #4a5568;
}

.share-option-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.share-option-label {
    font-size: 0.95em;
    font-weight: 600;
    color: var(--text-color, #1a202c);
    cursor: pointer;
}

body.dark .share-option-label {
    color: #e2e8f0;
}

.share-option-desc {
    font-size: 0.8em;
    color: var(--text-secondary, #718096);
    line-height: 1.4;
}

body.dark .share-option-desc {
    color: #a0aec0;
}

/* Toggle Switch Styles */
.share-toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
}

.share-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.share-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .3s;
    border-radius: 24px;
}

body.dark .share-toggle-slider {
    background-color: #475569;
}

.share-toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .share-toggle-slider {
    background-color: var(--success, #10b981);
}

input:focus + .share-toggle-slider {
    box-shadow: 0 0 1px var(--success, #10b981);
}

input:checked + .share-toggle-slider:before {
    transform: translateX(20px);
}
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("CSS replaced successfully.")
else:
    print("Search block not found in CSS.")
