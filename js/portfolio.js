'use strict';

const ipgeolocation = 'https://api.ipgeolocation.io/ipgeo?apiKey=1785ed53312f42c7b5ef89f65c3faa1a';

const timeouts = [];

const mobileAndTabletCheck = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if ($.cookie('videoTime')) {
    app.videoElement.currentTime = $.cookie('videoTime');
    app.audioElement.currentTime = $.cookie('videoTime');
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.body.onkeyup = (event) => {
    if (event.keyCode == 32 && app.skippedIntro) {
        if (app.backgroundToggler) {
            app.videoElement.play();
            app.audioElement.play();
        } else {
            app.videoElement.pause();
            app.audioElement.pause();
        }

        return (app.backgroundToggler = !app.backgroundToggler);
    }
};

$('html').on('contextmenu', (event) => {
    const img = document.createElement('img');

    const handLight = app.skippedIntro ? '' : 'hand-light';

    img.src = 'images/Night.png';
    img.width = 150;
    img.height = 100;
    img.alt = '';
    img.style = `position: absolute; left: ${event.pageX}px; top: ${event.pageY}px; z-index: 10`;
    img.className = `hand ${handLight}`;

    document.body.appendChild(img);
});

setInterval(() => {
    $('.hand').remove();
}, 600);

$('.skip').click(() => {
    skipIntro();
});

$.fn.extend({
    animateCss: function(animationName) {
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        this.addClass(`animated ${animationName}`).one(animationEnd, () => {
            $(this).removeClass(`animated ${animationName}`);
        });

        return this;
    },
});

const writeLine = (text, speed, timeout, callback) => {
    timeout = typeof timeout === 'number' ? timeout : [0, (callback = timeout)];

    const lineNumber = app.id !== 2 ? ++app.id : (app.id += 2);

    setTimeout(() => {
        const typed = new Typed(`#line${lineNumber}`, {
            strings: text,
            typeSpeed: speed,
            onComplete: callback,
        });
    }, timeout);
};

$.getJSON(ipgeolocation, (data) => {
    writeLine(['Authenticating...', "Granting access to <span style='font-size: 14px; color: #06d;'>[unknown]</span>..."], 30, () => {
        if (app.skippedIntro) return;

        clearCursor();

        const usernames = ['user', 'dude'];

        const ip = data.ip ? data.ip : usernames[Math.floor(Math.random() * usernames.length)];
        const country = data.country_name ? data.country_name : 'your country';

        writeLine([`Access granted! <span style='font-size: 14px; color: #0f0;'>[success]</span>`, `Welcome back, <i style='color: #0f0'>${ip}</i>! By the way, nice to see someone from ${country} here!`], 30, 500, () => {
            if (app.skippedIntro) return;

            clearCursor();

            writeLine([`<i style='color: #F62459'>Nightchill.gg</i>`], 120, 500, () => {
                timeouts.push(
                    setTimeout(() => {
                        if (app.skippedIntro) return;

                        clearCursor();

                        setTimeout(() => {
                            skipIntro();
                        }, 500);
                    }, 1)
                );
            });
        });
    });
});

const skipIntro = () => {
    if (app.skippedIntro) return;

    app.skippedIntro = true;

    timeouts.forEach((timeout) => {
        clearTimeout(timeout);
    });

    $('.top-right').remove();

    $('#main').fadeOut(100, () => {
        $('#main').remove();

        $('#marquee').marquee({
            duration: 15000,
            gap: 420,
            delayBeforeStart: 1000,
            direction: 'left',
            duplicated: true,
        });

        setTimeout(() => {
            $('.brand-header').animateCss(app.effects[Math.floor(Math.random() * app.effects.length)]);
        }, 200);

        setTimeout(() => {
            if (!app.shouldIgnoreVideo) {
                app.videoElement.play();
                app.audioElement.play();
            }

            app.videoElement.addEventListener(
                'timeupdate',
                () => {
                    $.cookie('videoTime', app.videoElement.currentTime, { expires: 1 });
                },
                false
            );

            $('.marquee-container').css('visibility', 'visible').hide().fadeIn(100);

            $('.marquee-container').animateCss('zoomIn');

            $('.container').fadeIn();

            $('.background').fadeIn(200, () => {
                if (!app.shouldIgnoreVideo) $('#audio').animate({ volume: app.musicVolume }, app.musicFadeIn);
            });
        }, 200);
    });
};

const svgPath = document.querySelectorAll('.path');
const svgText = anime({
    targets: svgPath,
    loop: true,
    direction: 'alternate',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 700,
    delay: (el, i) => {
        return i * 500;
    }
});