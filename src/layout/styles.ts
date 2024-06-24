import { setModelBasedOnTab } from '../editor/editor.main';
import './layout-colors.css';

let activeTab: 0 | 1 | 2 = 0;

// Add tab functionality
const tabs = document.querySelectorAll<HTMLElement>('#editor-top-bar > .tab');
for (let i = 0; i < tabs.length; i++)
  tabs[i].addEventListener('mousedown', () =>
    setTimeout(() => setActiveTab(i as 0 | 1 | 2), 100)
  );

function setActiveTab(tab: 0 | 1 | 2) {
  activeTab = tab;
  tabs.forEach((tab, i) => {
    if (i === activeTab) {
      tab.classList.remove('inactive-tab');
      tab.classList.add('active-tab');
    } else {
      tab.classList.remove('active-tab');
      tab.classList.add('inactive-tab');
    }
  });

  setModelBasedOnTab(activeTab);
}

setActiveTab(0);
