import type { Component } from 'vue';

import SectionHeroPrimary from '~/components/Section/Hero/Primary.vue';
import SectionAboutPrimary from '~/components/Section/About/Primary.vue';
import SectionDemoUIButtons from '~/components/Section/DemoUI/Buttons.vue';
import SectionTechnologies from '~/components/Section/Technologies/index.vue';
import SectionServicesPrimary from '~/components/Section/Services/Primary.vue';
import SectionContacts from '~/components/Section/Contacts/index.vue';
import SectionContactsSimple from '~/components/Section/Contacts/Simple.vue';
import SectionProcessPrimary from '~/components/Section/Process/Primary.vue';
import SectionCtaPrimary from '~/components/Section/Cta/Primary.vue';
import SectionProjectsPrimary from '~/components/Section/Projects/Primary.vue';

/**
 * Карта блоков модульной системы: `type` из content JSON → Vue-компонент секции.
 * Единая точка регистрации: новый блок = импорт компонента + строка в объекте.
 *
 * Конвенция type: Section/<Group>/<Variant>.vue → kebab(Group)-kebab(Variant);
 * если файл index.vue → kebab(Group). Подробнее — CLAUDE.md, «Блочная система».
 */
export const componentsMap: Record<string, Component> = {
  'hero-primary': SectionHeroPrimary,
  'about-primary': SectionAboutPrimary,
  'demo-ui-buttons': SectionDemoUIButtons,
  'technologies': SectionTechnologies,
  'services-primary': SectionServicesPrimary,
  'contacts': SectionContacts,
  'contacts-simple': SectionContactsSimple,
  'process-primary': SectionProcessPrimary,
  'cta-primary': SectionCtaPrimary,
  'projects-primary': SectionProjectsPrimary,
};
