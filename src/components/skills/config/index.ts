import css from './css';
import git from './git';
import html from './html';
import mongodb from './mongodb';
import nginx from './nginx';
import python from './python';
import terraform from './terraform';
import vue from './vue';

export const PATHS: object = {
  css,
  git,
  html,
  mongodb,
  nginx,
  python,
  terraform,
  vue,
};

export const SKILLS_CSS = `
#icon-wrapper {
  display: flex;
  flex-wrap: wrap;
}

#icon-wrapper svg {
  background: rgba(250, 250, 250, .2);
  border: 1px solid rgba(0,0,0,.01);
  border-radius: 12px;
  box-shadow: 2px 2px 2px rgba(0,0,0,.2), -1px -1px 1px rgba(0,0,0,.05);
  margin: 12px;
  padding: 8px;
}
`;
