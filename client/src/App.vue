<template>
  <div id="app">
    <Toast :visible="toastVisible" :message="toastMessage" :type="toastType" />
    <router-view />
  </div>
</template>

<script>
import Toast from "@/components/Toast";
import { EventBus } from "@/utils/eventBus";

export default {
  name: "App",
  components: {
    Toast,
  },
  data() {
    return {
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
      toastTimer: null,
    };
  },
  mounted() {
    EventBus.$on("showToast", (options) => {
      this.showToast(options);
    });
  },
  beforeDestroy() {
    EventBus.$off("showToast");
  },
  methods: {
    showToast({ message, type = "error", duration = 3000 }) {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }
      this.toastMessage = message;
      this.toastType = type;
      this.toastVisible = true;
      this.toastTimer = setTimeout(() => {
        this.toastVisible = false;
      }, duration);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
