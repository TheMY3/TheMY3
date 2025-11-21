import Ansible from './ansible';
import Arch from './arch';
import AWS from './aws';
import Bash from './bash';
import Bootstrap from './bootstrap';
import CentOS from './centos';
import Claude from './claude';
import Cloudflare from './cloudflare';
import Codex from './codex';
import Copilot from './copilot';
import CSS from './css';
import Digitalocean from './digitalocean';
import Docker from './docker';
import Fedora from './fedora';
import Git from './git';
import Golang from './golang';
import HTML from './html';
import Hyprland from './hyprland';
import Javascript from './javascript';
import Jquery from './jquery';
import Kubernetes from './kubernetes';
import Laravel from './laravel';
import Linode from './linode';
import Lua from './lua';
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
import Sublime from './sublime';
import Sway from './sway';
import Terraform from './terraform';
import Ubuntu from './ubuntu';
import Vercel from './vercel';
import Vue from './vue';
import Windsurf from './windsurf';
import Zsh from './zsh';

// @link https://svg2jsx.com/
// @link https://www.svgrepo.com/
export const PATHS: object = {
  Ansible,
  Arch,
  AWS,
  Bash,
  Bootstrap,
  CentOS,
  Claude,
  Cloudflare,
  Codex,
  Copilot,
  CSS,
  Digitalocean,
  Docker,
  Fedora,
  Git,
  Golang,
  HTML,
  Hyprland,
  Javascript,
  Jquery,
  Kubernetes,
  Laravel,
  Linode,
  Lua,
  Manticore,
  Mongodb,
  Mysql,
  Neovim,
  Nginx,
  Phpstorm,
  Postgresql,
  Python,
  PHP,
  Redis,
  Sqlite,
  Sublime,
  Sway,
  Terraform,
  Ubuntu,
  Vercel,
  Vue,
  Windsurf,
  Zsh,
};

export const SKILLS_CSS = `
#icon-wrapper {
  display: flex;
  flex-wrap: wrap;
}

#icon-wrapper > div {
  display: inline-block;
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
