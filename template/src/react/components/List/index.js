import React, { Component, PropTypes } from 'react';
import { message } from 'antd';
import './style.css';

const Notification = props => {
  const { notification } = props;
  if (notification.show) {
    if (notification.class === 'success') {
      message.success(notification.message, notification.duration);
    } else if (notification.class === 'error') {
      message.error(notification.message, notification.duration);
    } else {
      message.info(notification.message, notification.duration);
    }
  }
  return null;
};

export default Notification;
