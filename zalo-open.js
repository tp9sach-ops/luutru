/* ZALO-OPEN v1 – mở link trong trình duyệt Zalo (in-app) thì Zalo chặn menu chia sẻ + không đưa ảnh sang app Facebook được => hiện bảng "MỞ BẰNG TRÌNH DUYỆT" ngay khi vào trang.
   Android: intent:// mở trình duyệt mặc định (Chrome...). iPhone: x-safari-https:// mở Safari. Nếu hệ thống không cho mở (sau ~1,6 s trang vẫn còn ở Zalo) -> hiện hướng dẫn bấm ⋯ > "Mở bằng trình duyệt" + nút sao chép liên kết.
   Khách chọn "Tiếp tục trong Zalo": nhớ lựa chọn trong phiên (không hỏi lại). Trúng quà trong Zalo mà bấm CHIA SẺ LÊN FACEBOOK: hiện hướng dẫn lưu ảnh + dán caption (caption tự sao chép).
   Thử trên máy tính: thêm ?zalo=1 vào link. Tắt hẳn: ?noz=1. Không đụng game.js / share-fix.js. */
(function () {
  'use strict';
  var UA = navigator.userAgent || '', Q = location.search;
  if (/[?&]noz=1/.test(Q)) return;
  if (!(/Zalo/i.test(UA) || /[?&]zalo=1/.test(Q))) return;
  var IOS = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1), AND = /Android/i.test(UA);
  var OV = null, opened = false;

  function target() { return location.href.split('#')[0].replace(/([?&])zalo=1(&|$)/, function (m, a, b) { return b ? a : ''; }).replace(/[?&]$/, ''); }
  function mk(tag, css, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }
  function copyText(t) {
    try { var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length); document.execCommand('copy'); ta.remove(); } catch (e) {}
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(function () {}); } catch (e) {}
  }
  function remember() { try { sessionStorage.setItem('zl_ok', '1'); } catch (e) {} }
  function remembered() { try { return sessionStorage.getItem('zl_ok') === '1'; } catch (e) { return false; } }
  function close() { if (OV) { OV.remove(); OV = null; } }

  window.addEventListener('pagehide', function () { opened = true; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) opened = true; });

  function openExternal(hint) {
    var u = target(), href, a, top = false;
    opened = false;
    try { top = window.top !== window; } catch (e) { top = true; }
    if (AND) href = 'intent://' + u.replace(/^https?:\/\//i, '') + '#Intent;scheme=' + (/^https:/i.test(u) ? 'https' : 'http') + ';action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end';
    else if (IOS) href = 'x-safari-' + u;
    else { try { window.open(u, '_blank'); } catch (e) {} href = ''; }
    if (href) {
      try { a = document.createElement('a'); a.href = href; a.target = top ? '_top' : '_self'; a.rel = 'noopener'; a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove(); }
      catch (e) { try { location.href = href; } catch (x) {} }
    }
    setTimeout(function () { if (!opened && hint) hint.style.display = 'block'; }, 1600);
  }

  function shell(emoji, title, body) {
    close();
    OV = mk('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;box-sizing:border-box;background:radial-gradient(ellipse at 50% 0,#1b7a55 0,#0d4a36 55%,#041a12 100%);font-family:"Be Vietnam Pro",system-ui,-apple-system,sans-serif;color:#fff;text-align:center;overflow:auto');
    var box = mk('div', 'width:100%;max-width:360px');
    box.appendChild(mk('div', 'font-size:56px;line-height:1;margin-bottom:10px', emoji));
    box.appendChild(mk('h2', 'margin:0 0 10px;font-size:24px;line-height:1.25;font-weight:800;color:#ffd27a;text-shadow:0 2px 0 #a3102a', title));
    box.appendChild(mk('p', 'margin:0 0 16px;font-size:15.5px;line-height:1.5;font-weight:600;color:#d9f2e4', body));
    OV.appendChild(box); document.body.appendChild(OV);
    return box;
  }
  var BTN = 'display:block;width:100%;box-sizing:border-box;font:inherit;font-size:18px;font-weight:800;border:0;border-radius:16px;padding:14px 16px;margin:0 0 10px;cursor:pointer;touch-action:manipulation;';
  var GOLD = BTN + 'color:#7a0a1c;background:linear-gradient(#ffd95a,#ffb300);border-bottom:5px solid #b37a00;';
  var GHOST = BTN + 'color:#fff;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.4);font-size:16px;';

  function showOpen() {
    var browser = IOS ? 'Safari' : 'Chrome / trình duyệt';
    var box = shell('🌐', 'Mở bằng trình duyệt để chơi nhé!', 'Bạn đang mở link trong <b>Zalo</b>. Zalo chặn chia sẻ ảnh lên Facebook. Bấm nút bên dưới để mở bằng <b>' + browser + '</b>.');
    var hint = mk('div', 'display:none;margin:2px 0 12px;padding:12px;border-radius:12px;background:rgba(0,0,0,.28);font-size:14px;line-height:1.5;font-weight:600;color:#fff4cf;text-align:left', 'Chưa tự mở được? Bấm dấu <b>⋯</b> (hoặc <b>⋮</b>) ở góc trên bên phải của Zalo, chọn <b>«Mở bằng trình duyệt»</b>. Hoặc bấm <b>Sao chép liên kết</b> rồi dán vào ' + browser + '.');
    var b1 = mk('button', GOLD, '🌐 MỞ BẰNG TRÌNH DUYỆT'), b2 = mk('button', GHOST, '📋 Sao chép liên kết'), b3 = mk('button', 'display:block;margin:6px auto 0;background:none;border:0;color:#b9e3cd;font:inherit;font-size:14px;font-weight:700;text-decoration:underline;padding:8px;cursor:pointer', 'Tiếp tục trong Zalo (không chia sẻ được Facebook)');
    b1.type = b2.type = b3.type = 'button';
    b1.onclick = function () { openExternal(hint); };
    b2.onclick = function () { copyText(target()); b2.textContent = '✅ Đã sao chép – dán vào trình duyệt'; hint.style.display = 'block'; };
    b3.onclick = function () { remember(); close(); };
    box.appendChild(b1); box.appendChild(b2); box.appendChild(hint); box.appendChild(b3);
  }

  function showShare() {
    var h = document.querySelector('#rs .box h1'), prize = h ? h.textContent.trim() : '',
      cap = 'Mình vừa về nhất Đường Đua Quà Giáng Sinh của 9 Sạch và trúng ' + prize + '! 🐯🎄\n#9sach #banhsaurieng9sach #duacop #duongduaquagiangsinh';
    copyText(cap);
    var box = shell('📣', 'Zalo chưa chia sẻ được lên Facebook', 'Caption đã được <b>sao chép</b>. Nhấn giữ ảnh chiến thắng → <b>Lưu ảnh</b>. Sau đó mở <b>Facebook</b> → Tạo bài viết → chọn ảnh → dán caption → Đăng. Lần sau hãy mở link bằng trình duyệt để chia sẻ 1 chạm nhé.');
    var b = mk('button', GOLD, 'Đã hiểu'); b.type = 'button'; b.onclick = close; box.appendChild(b);
  }

  /* bấm CHIA SẺ LÊN FACEBOOK trong Zalo: chặn lần bấm của share-fix.js (pha bắt sự kiện chạy trước onclick của nút) */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('#sb2');
    if (!t) return;
    e.preventDefault(); e.stopImmediatePropagation(); showShare();
  }, true);

  function start() { if (!remembered() || /[?&]zalo=1/.test(Q)) showOpen(); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
