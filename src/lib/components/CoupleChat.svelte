<script>
  import { onMount, onDestroy } from 'svelte';
  import { fetchAPI } from '$lib/api';
  import { checkPairingStatus } from '$lib/pairing';
  import { getSessionCookie } from '$lib/api';

  export let userId;
  
  let messages = [];
  let newMessage = '';
  let socket = null;
  let isLoading = true;
  let isConnected = false;
  let coupleId = null;
  
  // Load message history
  async function loadMessageHistory() {
    try {
      const response = await fetchAPI(`couple/messages/`);
      if (response) {
        messages = response;
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      isLoading = false;
    }
  }
  
  onMount(async () => {
    await loadMessageHistory();

    const { sessionId, csrfToken } = getSessionCookie();
    const token = localStorage.getItem('access_token');
    const pair = await checkPairingStatus();
    coupleId = pair.couple_id;

    if (!coupleId) {
      console.error('No couple ID found');
      return;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = import.meta.env.VITE_BACKEND_HOST || window.location.host;
    const wsUrl = `${wsProtocol}//${backendHost}/ws/chat/${coupleId}?token=${token}`;
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      isConnected = true;
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'auth',
        token: token,
        session: sessionCookie,
        sessionId: sessionId,
        csrfToken: csrfToken
      }));
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      isConnected = false;
      console.log('WebSocket disconnected');
    };
    
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat_message') {
        messages = [...messages, {
          id: data.message_id,
          text: data.message,
          sender: data.sender,
          timestamp: data.timestamp,
          isMe: data.sender === userId
        }];
      }
    };
  });
  
  onDestroy(() => {
    if (socket) {
      socket.close();
    }
  });
  
  async function sendMessage() {
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    try {
      socket.send(JSON.stringify({
        message: newMessage.trim()
      }));
      newMessage = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<div class="chat-container">
  {#if isConnected}
    <div class="text-green-500">Connected to chat</div>
  {:else}
    <div class="text-red-500">Disconnected from chat</div>
  {/if}

  <div class="messages">
    {#each messages as msg}
      <div class="message {msg.isMe ? 'sent' : 'received'}">
        <p>{msg.text}</p>
        <span class="meta">
          {msg.isMe ? 'You' : msg.sender} at {formatTime(msg.timestamp)}
        </span>
      </div>
    {/each}
  </div>
  
  <div class="input-area">
    <input 
      type="text" 
      bind:value={newMessage}
      placeholder="Type a message..."
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
    />
    <button on:click={sendMessage} disabled={!newMessage.trim()}>
      Send
    </button>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }
  
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }
  
  .message {
    margin: 0.5rem 0;
    padding: 0.75rem;
    border-radius: 1rem;
    max-width: 75%;
    word-wrap: break-word;
  }
  
  .sent {
    background: #007bff;
    color: white;
    margin-left: auto;
    text-align: right;
  }
  
  .received {
    background: #f1f1f1;
    margin-right: auto;
  }
  
  .meta {
    font-size: 0.75rem;
    opacity: 0.8;
    display: block;
    margin-top: 0.25rem;
  }
  
  .input-area {
    display: flex;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>