<template>
  <div class="skeleton-card">
    <div class="skeleton-content">
      <div class="skeleton-title shimmer"></div>
      <div class="skeleton-message shimmer"></div>
      <div class="skeleton-date shimmer"></div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.skeleton-card {
  background: rgba(59, 130, 246, 0.08);
  border-left: 4px solid rgba(59, 130, 246, 0.4);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  backdrop-filter: blur(10px);
}

/* shimmer animation */
.shimmer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(59, 130, 246, 0.25) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmerMove 1.5s infinite linear;
  border-radius: 6px;
}

@keyframes shimmerMove {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ukuran */
.skeleton-title {
  width: 60%;
  height: 16px;
  margin-bottom: 10px;
}

.skeleton-message {
  width: 90%;
  height: 12px;
  margin-bottom: 8px;
}

.skeleton-date {
  width: 40%;
  height: 10px;
}
</style>
