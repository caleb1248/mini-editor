import './toast.css';

const notificationsContainer = document.createElement('div');
notificationsContainer.classList.add('notifications-container');
document.querySelector('#app')?.appendChild(notificationsContainer);

function createIcon(type: string): HTMLElement {
  const icon = document.createElement('div');

  icon.classList.add('codicon', `codicon-${type}`, 'notification-icon');

  return icon;
}

function showInformationMessage(message: string) {
  const notification = document.createElement('div');
  notification.tabIndex = 0;
  notification.classList.add('notification');

  createNotification(notification, createIcon('info'), message);

  insertNotification(notification);
}

function showErrorMessage(message: string) {
  const notification = document.createElement('div');
  notification.classList.add('notification');

  createNotification(notification, createIcon('error'), message);

  insertNotification(notification);
}

/**
 * Internal
 */
function createNotification(
  notificationElement: HTMLElement,
  iconElement: HTMLElement,
  message: string
) {
  notificationElement.classList.add('collapsed');
  notificationElement.appendChild(iconElement);

  const messageElement = document.createElement('div');
  messageElement.classList.add('notification-message-container');

  const span = messageElement.appendChild(document.createElement('span'));
  span.innerText = message;

  notificationElement.appendChild(messageElement);

  const actionList = document.createElement('ul');
  actionList.classList.add('action-toolbar');

  const expandButton = document.createElement('li');
  expandButton.classList.add('codicon', 'codicon-chevron-up');
  expandButton.onclick = () => {
    notificationElement.classList.toggle('collapsed');
    notificationElement.classList.toggle('expanded');
    expandButton.classList.toggle('codicon-chevron-down');
    expandButton.classList.toggle('codicon-chevron-up');
  };
  actionList.appendChild(expandButton);

  const closeButton = document.createElement('li');

  closeButton.classList.add('codicon', 'codicon-close');
  closeButton.onclick = () => {
    notificationElement.remove();
  };

  actionList.appendChild(closeButton);
  notificationElement.appendChild(actionList);
}

function insertNotification(notification: HTMLElement) {
  const firstNotification = notificationsContainer.firstChild;
  if (firstNotification) {
    notificationsContainer.insertBefore(notification, firstNotification);
  } else {
    notificationsContainer.appendChild(notification);
  }
}

export { showInformationMessage, showErrorMessage };
