const details = (button) => {
  const content = button.parentElement.parentElement.nextElementSibling;
  console.log(content);
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

const subnavItem = document.querySelector('#dropdown-header');
const subnavDropdown = document.querySelector('#subnav-dropdown');

subnavItem.addEventListener('mouseover', () => {
    subnavDropdown.style.display = 'block';
});

subnavDropdown.addEventListener('mouseover', event => {
    if (!subnavItem.contains(event.relatedTarget)) 
        subnavDropdown.style.display = 'block';
});

subnavItem.addEventListener('mouseout', (event) => {
  if (!subnavDropdown.contains(event.relatedTarget))
      subnavDropdown.style.display = 'none';
});

subnavDropdown.addEventListener('mouseout', (event) => {
  if (!subnavDropdown.contains(event.relatedTarget))
      subnavDropdown.style.display = 'none';
});
