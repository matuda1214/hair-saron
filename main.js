/**
 * Verdure Hair Salon — main.js
 */
'use strict';

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
  });

  var targetPage = document.getElementById('page-' + id);
  if (targetPage) targetPage.classList.add('active');

  var targetNav = document.getElementById('nav-' + id);
  if (targetNav) targetNav.classList.add('active');

  // ハンバーガーメニューを閉じる
  closeMenu();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMenu() {
  var hamburger = document.getElementById('nav-hamburger');
  var navList   = document.getElementById('nav-links-list');
  if (hamburger) hamburger.classList.remove('open');
  if (navList)   navList.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  showPage('home');

  // ハンバーガーボタンのトグル
  var hamburger = document.getElementById('nav-hamburger');
  var navList   = document.getElementById('nav-links-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      navList.classList.toggle('open');
    });
  }

  // メニュー外タップで閉じる
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) closeMenu();
  });
});
