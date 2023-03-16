import React, { useState, useEffect, useRef } from "react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import OnlineStatusMock from "./OnlineStatusMock";
import "./App.css";

const DURATION = 2000;

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  return [isOnline, setIsOnline];
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const App = () => {
  const [isOnline, setIsOnline] = useOnlineStatus();
  const prevIsOnline = usePrevious(isOnline);
  const offlineTimeout = useRef(null);

  const getLastNotificationStatus = () => {
    const notifications = NotificationManager.listNotify;
    return notifications.length > 0
      ? notifications[notifications.length - 1].message
      : null;
  };

  useEffect(() => {
    if (isOnline !== prevIsOnline) {
      if (!isOnline) {
        offlineTimeout.current = setTimeout(() => {
          const lastNotificationStatus = getLastNotificationStatus();
          if (
            lastNotificationStatus !== "Offline" ||
            NotificationManager.listNotify.length === 0
          ) {
            NotificationManager.info("Offline");
          }
        }, DURATION);
      } else {
        clearTimeout(offlineTimeout.current);
        const lastNotificationStatus = getLastNotificationStatus();
        if (
          lastNotificationStatus !== "Online" ||
          NotificationManager.listNotify.length === 0
        ) {
          NotificationManager.info("Online");
        }
      }
    }
  }, [isOnline, prevIsOnline]);

  return (
    <>
      <OnlineStatusMock onIsOnlineChange={setIsOnline} />
      <div className={isOnline ? "online" : "offline"}>
        {isOnline ? "Online" : "Offline"}
        <NotificationContainer />
      </div>
    </>
  );
};

export default App;
