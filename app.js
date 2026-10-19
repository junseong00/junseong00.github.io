'use strict';
const projectButtons = [...document.querySelectorAll('[data-project-filter]')];
if (projectButtons.length) {
  document.querySelector('.project-filters').hidden = false;
  const projects = [...document.querySelectorAll('[data-project]')];
  projectButtons.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    projectButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let count = 0;
    projects.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.project !== category;
      if (!project.hidden) count++;
    });
    document.querySelector('.project-result').textContent = `${count}개 프로젝트`;
  }));
}
const controls = document.querySelector('.publication-controls');
if (controls) {
  const search = document.querySelector('#publication-search');
  const first = document.querySelector('#first-author');
  const year = document.querySelector('#year-filter');
  const topic = document.querySelector('#topic-filter');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const records = [...document.querySelectorAll('.publication')];
  const searchable = new Map(records.map(record => [record, record.textContent.normalize('NFC').toLocaleLowerCase()]));
  let category = 'all';
  function applyFilters() {
    const terms = search.value.normalize('NFC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    records.forEach(record => {
      const data = record.dataset;
      record.hidden = !((category === 'all' || data.category === category)
        && (!first.checked || data.first === 'true')
        && (year.value === 'all' || data.year === year.value)
        && (topic.value === 'all' || data.topic === topic.value)
        && terms.every(term => searchable.get(record).includes(term)));
      if (!record.hidden) count++;
    });
    document.querySelector('#result-count').textContent = `${count}건 표시`;
    document.querySelector('#no-results').hidden = count !== 0;
  }
  function resetFilters() {
    category = 'all'; search.value = ''; first.checked = false; year.value = 'all'; topic.value = 'all';
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
    applyFilters();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);
  [first, year, topic].forEach(control => control.addEventListener('change', applyFilters));
  document.querySelector('#reset-filters').addEventListener('click', resetFilters);
  function revealLinkedRecord() {
    if (!/^#pub-\d+$/.test(location.hash)) return;
    const record = document.getElementById(location.hash.slice(1));
    if (!record) return;
    resetFilters();
    record.scrollIntoView({block:'start'});
    record.focus({preventScroll:true});
  }
  controls.hidden = false;
  window.addEventListener('hashchange', revealLinkedRecord);
  revealLinkedRecord();
}
