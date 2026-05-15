<template>
  <div class="skeleton-card">
    <div class="skeleton-header">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-icon"></div>
    </div>
    <div class="skeleton-line title"></div>
    <div class="skeleton-line subtitle"></div>
  </div>
</template>

<script setup>
// komponen ini tanpa script, full UI
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.skeleton-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: cardSlideIn 0.5s ease-out both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skeleton-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.2) 25%,
    rgba(139, 92, 246, 0.3) 50%,
    rgba(99, 102, 241, 0.2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(248, 113, 113, 0.2) 25%,
    rgba(248, 113, 113, 0.3) 50%,
    rgba(248, 113, 113, 0.2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite 0.3s;
}

.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-line.title {
  width: 70%;
  height: 20px;
}

.skeleton-line.subtitle {
  width: 50%;
  height: 16px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
