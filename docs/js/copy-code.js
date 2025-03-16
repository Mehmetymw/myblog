document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('.highlight');
  
  codeBlocks.forEach(block => {
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = 'Copy';
    block.appendChild(button);

    // Add click handler
    button.addEventListener('click', async () => {
      // Get the code content, excluding line numbers
      const codeContent = block.querySelector('td:last-child code')?.innerText || 
                         block.querySelector('code')?.innerText || '';

      try {
        await navigator.clipboard.writeText(codeContent);
        button.textContent = 'Copied!';
        
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        button.textContent = 'Error!';
      }
    });
  });
}); 