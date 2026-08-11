<script setup lang="ts">

</script>

<template>
  <section class="demo --btns">
    <div class="container">
      <div class="demo-inner">
        <h3>Кнопка из сайта мастеркард</h3>
        <button type="button" class="button --primary">
          <span class="button-inner">Start Free Trial</span>
          <span class="button-hover">Start Free Trial</span>
        </button>
        <br>
        <h3>Кнопка с плавным подчеркиванием</h3>
        <button type="button" class="button --secondary underline-link">
          <span>Book a Demo</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: 'InterTight', sans-serif;
  text-align: center;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  height: fit-content;
  width: fit-content;
  z-index: 1;
  max-width: 100%;
  transition: all 0.6s ease-in-out;

  &.--primary {
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: 5rem;
    color: var(--font-white);
    background-color: var(--btn-main);
    position: relative;

    &:hover {
      .button-inner {
        transform: translateY(-100%);
      }

      .button-hover {
        clip-path: inset(0 0 round 50px);
        transform: translateY(0);
      }
    }

    .button {
      &-inner {
        align-items: center;
        display: inline-flex;
        gap: 1.6rem;
        justify-content: center;
        padding: 1.2rem 2.4rem;
        transition: all .6s cubic-bezier(.165, .84, .44, 1);
      }

      &-hover {
        position: absolute;
        align-items: center;
        display: inline-flex;
        gap: 1.6rem;
        justify-content: center;
        background-color: var(--btn-hover);
        padding: 1.2rem 2.4rem;
        clip-path: inset(0 calc(50% - 25px) round 50px);
        transform: translateY(100%);
        transition: all .6s cubic-bezier(.165, .84, .44, 1);
      }
    }
  }
  &.--secondary {
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: 5rem;
    color: var(--font-accent);
    // background-color: var(--btn-main);
    padding: 1.2rem 2.4rem;

    &:has(span + svg) {
      span {
        margin-right: 0.8rem;
      }
    }
  }
}

.underline-link {
  span {
    background-image: linear-gradient(
      transparent calc(100% - 0.1em),
      var(--font-accent) 0.1em
    );
    background-position-y: 100%;
    background-repeat: no-repeat;
    background-size: 0;
    display: inline;
    transition: background-size 1s cubic-bezier(0.3, 0.86, 0.36, 0.95);
  }

  &:hover {
    text-decoration: none !important;

    span {
      background-size: 100%;
    }
  }
}
</style>