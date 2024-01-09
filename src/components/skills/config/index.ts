import Ansible from './ansible';
import Arch from './arch';
import AWS from './aws';
import Bootstrap from './bootstrap';
import CSS from './css';
import Cloudflare from './cloudflare';
import Digitalocean from './digitalocean';
import Docker from './docker';
import Javascript from './javascript';
import Jquery from './jquery';
import Git from './git';
import Golang from './golang';
import HTML from './html';
import Kubernetes from './kubernetes';
import Laravel from './laravel';
import Linode from './linode';
import Manticore from './manticore';
import Mongodb from './mongodb';
import Mysql from './mysql';
import Neovim from './neovim';
import Nginx from './nginx';
import Phpstorm from './phpstorm';
import Postgresql from './postgresql';
import PHP from './php';
import Python from './python';
import Redis from './redis';
import Sqlite from './sqlite';
import Sway from './sway';
import Terraform from './terraform';
import Ubuntu from './ubuntu';
import Vue from './vue';
import Zsh from './zsh';

// @link https://svg2jsx.com/
// @link https://www.svgrepo.com/
export const PATHS: object = {
  Ansible,
  Arch,
  AWS,
  Bootstrap,
  Cloudflare,
  CSS,
  Digitalocean,
  Docker,
  Git,
  Golang,
  Javascript,
  Jquery,
  HTML,
  Kubernetes,
  Laravel,
  Linode,
  Manticore,
  Mongodb,
  Mysql,
  Nginx,
  Neovim,
  Phpstorm,
  Postgresql,
  Python,
  PHP,
  Redis,
  Sqlite,
  Sway,
  Terraform,
  Ubuntu,
  Vue,
  Zsh,
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
