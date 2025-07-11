import Pusher from 'pusher-js'

let activeChannel;
let pusher;
let couple_channel 


// Subscribe to private channel
export function initPusher(userId) {
  if (!pusher) {
    pusher = new Pusher('2d9060f8f7ec2034a519', {
      cluster: 'eu',
    });
  }

}


export function couplePusher(userId, coupleId, handlers = {}) {
  if(!pusher) {
      pusher = new Pusher('2d9060f8f7ec2034a519', {
      cluster: 'eu',
    });
  }

  if (couple_channel){
    couple_channel.unsubscribe()
  }

  couple_channel = pusher.subscribe(`couple-${coupleId}`);

  couple_channel.bind('task_created', data => {
    handlers.taskCreated?.(data);
  });

  couple_channel.bind('task_update', data => {
    handlers.taskUpdate?.(data);
  });

  couple_channel.bind('task_deleted', data => {
    handlers.taskDeleted?.(data);
  });

  couple_channel.bind('achievement_unlocked', data => {
    handlers.achievementUnlocked?.(data);
  });

  couple_channel.bind('streak_updated', data => {
    handlers.streakUpdated?.(data);
  });
  
}

export function subscribeToChannel(coupleId) {
  if (pusher) {
    if (activeChannel) {
      pusher.unsubscribe(activeChannel.name);
    }
    activeChannel = pusher.subscribe(`couple-${coupleId}`);
    return activeChannel;
  }
}

export function unsubscribeFromChannel() {
  if (pusher && activeChannel) {
    pusher.unsubscribe(activeChannel.name);
    activeChannel = null;
  }
}

export function disconnectPusher() {
  if (couple_channel) {
    couple_channel.unsubscribe();
    couple_channel = null;
  }
  if (pusher) {
    pusher.disconnect();
    pusher = null;
  }
}

export { activeChannel as channel };