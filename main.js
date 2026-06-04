/**
 * Verdure Hair Salon — main.js
 * ページ切り替え処理
 */

'use strict';

/**
 * 指定したページIDのページを表示し、ナビゲーションをアクティブにする
 * @param {string} id - ページID ('home' | 'menu' | 'stylists' | 'booking')
 */
function showPage(id) {
  // すべてのページを非表示
  var pages = document.querySelectorAll('.page');
  pages.forEach(function (page) {
    page.classList.remove('active');
  });

  // すべてのナビリンクを非アクティブ
  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    link.classList.remove('active');
  });

  // 指定ページを表示
  var targetPage = document.getElementById('page-' + id);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // 対応するナビリンクをアクティブ
  var targetNav = document.getElementById('nav-' + id);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // ページトップへスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ページ読み込み時にホームを表示
document.addEventListener('DOMContentLoaded', function () {
  showPage('home');
});
