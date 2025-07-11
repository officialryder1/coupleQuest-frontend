<script>
  export let delay = "0s";
</script>

<style>
  .heart-beat {
    animation: heartBeat 5s ease infinite;
    animation-delay: 1s;
  }
  @keyframes heartBeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
  }
</style>

<div class="heart-beat text-4xl">❤️</div>