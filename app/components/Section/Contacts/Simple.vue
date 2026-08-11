<script setup lang="ts">
const props = defineProps<{
  title?: string,
  text?: string,
  stepsTitle?: string,
  steps?: {
    title: string,
    content?: string,
  }[],
  /**
   * URL приёмника формы (Web3Forms / Formspree / serverless-прокси).
   * Сайт статический, своего бэкенда нет — пока endpoint не задан, отправка
   * сознательно не имитируется: форма валидируется и честно сообщает, что
   * канал не настроен. См. TODO «Форма-бриф» в CLAUDE.md.
   */
  endpoint?: string,
}>()

const { t } = useI18n()

type FieldName = 'name' | 'email' | 'phone' | 'message'
type Status = 'idle' | 'sending' | 'success' | 'error'

const form = reactive<Record<FieldName, string>>({
  name: '',
  email: '',
  phone: '',
  message: '',
})

// Показываем ошибку только после того, как поле трогали или жали submit —
// иначе пустая форма встречает посетителя красным.
const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  email: false,
  phone: false,
  message: false,
})

const status = ref<Status>('idle')
const statusMessage = ref('')

// Нарочно нестрогие проверки. Задача — отсечь опечатку, а не валидировать RFC:
// строгий email-regex чаще отбрасывает живые адреса, чем ловит мусор.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^[+()\d\s-]{7,}$/

const errors = computed<Partial<Record<FieldName, string>>>(() => {
  const result: Partial<Record<FieldName, string>> = {}

  if (!form.name.trim()) result.name = t('form.errors.required')

  if (!form.email.trim()) result.email = t('form.errors.required')
  else if (!emailPattern.test(form.email.trim())) result.email = t('form.errors.email')

  if (!form.phone.trim()) result.phone = t('form.errors.required')
  else if (!phonePattern.test(form.phone.trim())) result.phone = t('form.errors.phone')

  return result
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

const showError = (field: FieldName) => touched[field] && Boolean(errors.value[field])

async function onSubmit() {
  (Object.keys(touched) as FieldName[]).forEach((field) => {
    touched[field] = true
  })

  if (!isValid.value) return

  if (!props.endpoint) {
    status.value = 'error'
    statusMessage.value = t('form.status.notConfigured')
    return
  }

  status.value = 'sending'
  statusMessage.value = ''

  try {
    await $fetch(props.endpoint, {
      method: 'POST',
      body: { ...form },
    })

    status.value = 'success'
    statusMessage.value = t('form.status.success');

    (Object.keys(form) as FieldName[]).forEach((field) => {
      form[field] = ''
      touched[field] = false
    })
  }
  catch {
    status.value = 'error'
    statusMessage.value = t('form.status.error')
  }
}
</script>

<template>
  <section id="contacts" class="contacts-form --simple">
    <div class="container contacts-form__inner">
      <div class="contacts-form__aside">
        <h2 v-if="props.title" class="contacts-form__title">{{ props.title }}</h2>
        <p v-if="props.text" class="contacts-form__text">{{ props.text }}</p>

        <div v-if="props.steps?.length" class="contacts-form__steps">
          <h3 v-if="props.stepsTitle" class="contacts-form__steps-title">{{ props.stepsTitle }}</h3>

          <ol class="contacts-form__steps-list">
            <li v-for="(step, index) in props.steps" :key="index" class="contacts-form__steps-item">
              <!-- padStart, а не двузначные номера в контенте: нумерация — дело
                   отображения, редактор не должен её поддерживать руками. -->
              <span class="contacts-form__steps-num" aria-hidden="true">
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <span class="contacts-form__steps-body">
                <span class="contacts-form__steps-name">{{ step.title }}</span>
                <span v-if="step.content" class="contacts-form__steps-text">{{ step.content }}</span>
              </span>
            </li>
          </ol>
        </div>
      </div>

      <form class="contacts-form__form" novalidate @submit.prevent="onSubmit">
        <div class="contacts-form__field">
          <label class="contacts-form__label" for="contact-name">
            {{ $t('form.fields.name') }} <span class="contacts-form__required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            v-model="form.name"
            class="contacts-form__input"
            type="text"
            name="name"
            autocomplete="name"
            :aria-invalid="showError('name')"
            :aria-describedby="showError('name') ? 'contact-name-error' : undefined"
            @blur="touched.name = true"
          >
          <span v-if="showError('name')" id="contact-name-error" class="contacts-form__error">
            {{ errors.name }}
          </span>
        </div>

        <div class="contacts-form__field">
          <label class="contacts-form__label" for="contact-email">
            {{ $t('form.fields.email') }} <span class="contacts-form__required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            v-model="form.email"
            class="contacts-form__input"
            type="email"
            name="email"
            autocomplete="email"
            :aria-invalid="showError('email')"
            :aria-describedby="showError('email') ? 'contact-email-error' : undefined"
            @blur="touched.email = true"
          >
          <span v-if="showError('email')" id="contact-email-error" class="contacts-form__error">
            {{ errors.email }}
          </span>
        </div>

        <div class="contacts-form__field">
          <label class="contacts-form__label" for="contact-phone">
            {{ $t('form.fields.phone') }} <span class="contacts-form__required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            v-model="form.phone"
            class="contacts-form__input"
            type="tel"
            name="phone"
            autocomplete="tel"
            :aria-invalid="showError('phone')"
            :aria-describedby="showError('phone') ? 'contact-phone-error' : undefined"
            @blur="touched.phone = true"
          >
          <span v-if="showError('phone')" id="contact-phone-error" class="contacts-form__error">
            {{ errors.phone }}
          </span>
        </div>

        <div class="contacts-form__field --full">
          <label class="contacts-form__label" for="contact-message">
            {{ $t('form.fields.message') }}
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            class="contacts-form__input contacts-form__textarea"
            name="message"
            rows="5"
          />
        </div>

        <div class="contacts-form__actions">
          <button type="submit" class="button --primary" :disabled="status === 'sending'">
            {{ status === 'sending' ? $t('form.status.sending') : $t('form.submit') }}
          </button>

          <!-- role=status: сообщение появляется после действия, скринридер должен
               его озвучить, не перебивая ввод. -->
          <p
            v-if="statusMessage"
            class="contacts-form__status"
            :class="status === 'success' ? '--success' : '--error'"
            role="status"
          >
            {{ statusMessage }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contacts-form {
  padding: 6rem 0 12rem;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4.8rem;

    @include min-width(lg) {
      // Текстовая колонка чуть уже формы: форме нужнее ширина под поля.
      grid-template-columns: 0.85fr 1fr;
      gap: 6.4rem;
      align-items: start;
    }
  }

  &__text {
    max-width: 62rem;
    margin-top: 1.6rem;
    color: var(--font-muted);
  }

  &__steps {
    margin-top: 4rem;

    &-title {
      font-size: 1.4rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--font-muted);
    }

    &-list {
      @include normalize-list;
      margin-top: 2.4rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    &-item {
      display: grid;
      grid-template-columns: 3.2rem 1fr;
      column-gap: 1.6rem;
      align-items: baseline;
    }

    &-num {
      color: var(--font-accent);
      font-size: 1.4rem;
      font-weight: 700;
      // tabular-nums, иначе «01» и «04» имеют разную ширину и колонка едет.
      font-variant-numeric: tabular-nums;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    &-name {
      font-size: 1.6rem;
      font-weight: 600;
    }

    &-text {
      color: var(--font-muted);
      font-size: 1.5rem;
      line-height: 1.6;
    }
  }

  &__form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.4rem;
    max-width: 78rem;
    // Без margin-top: вертикальный отступ от текстовой колонки задаёт gap
    // самой сетки __inner, иначе в стеке они складываются в двойной провал.

    // Три короткие поля в один ряд. В две колонки нельзя: телефон остаётся
    // третьим и рядом с ним зияет пустая ячейка.
    @include min-width(md) {
      grid-template-columns: repeat(3, 1fr);
    }

    // В двухколоночной раскладке форма живёт в узкой колонке — там три поля
    // в ряд сжимаются до нечитаемых ~170px, поэтому возвращаем один столбец.
    @include min-width(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    // Message и кнопка занимают всю ширину сетки.
    &.--full {
      @include min-width(md) {
        grid-column: 1 / -1;
      }
    }
  }

  &__label {
    color: var(--font-muted);
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__required {
    color: var(--font-accent);
  }

  &__input {
    width: 100%;
    padding: 1.4rem 1.6rem;
    border: 0.1rem solid var(--color-green-200-20);
    border-radius: 0.8rem;
    background-color: color-mix(in srgb, var(--font-main) 3%, transparent);
    color: var(--font-main);
    font-family: inherit;
    font-size: 1.6rem;
    transition: border-color 0.3s ease-in-out;

    &:focus-visible {
      outline: none;
      border-color: var(--font-accent);
    }

    // aria-invalid как селектор: состояние живёт в одном месте (в разметке),
    // а не дублируется классом-модификатором.
    &[aria-invalid="true"] {
      border-color: var(--red);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 12rem;
    line-height: 1.6;
  }

  &__error {
    color: var(--red);
    font-size: 1.4rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.6rem 2.4rem;

    @include min-width(md) {
      grid-column: 1 / -1;
    }
  }

  &__status {
    font-size: 1.5rem;

    &.--success {
      color: var(--font-accent);
    }

    &.--error {
      color: var(--red);
    }
  }
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
