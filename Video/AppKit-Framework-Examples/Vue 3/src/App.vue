<script setup lang="ts">
import "@signalwire/app-kit";
import { ref, onMounted } from "vue";

const videoComponent = ref(null);

onMounted(() => {
  videoComponent.value.setupRoomSession = (rs) => {
    console.log("Setting up Room Session", rs);

    rs.on("room.joined", (e) =>
      console.log("Joined room:", e.room.display_name)
    );
  };
});
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="60"
      height="60"
    />

    <div class="wrapper">
      <h1 class="green">Welcome!</h1>
      <h3>
        You’ve successfully created a SignalWire video conference with
        <a target="_blank" href="https://vuejs.org/">Vue 3</a>, built with
        <a target="_blank" href="https://vitejs.dev/">Vite</a>.
      </h3>
    </div>
  </header>

  <main>
    <sw-video-conference
      token="vpt_25e67aace53a906f8387f2f499e9d8dd"
      user-name="Guest"
      device-picker="true"
      ref="videoComponent"
    ></sw-video-conference>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
  text-align: center;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  h1,
  h3 {
    text-align: left;
  }
}
</style>
