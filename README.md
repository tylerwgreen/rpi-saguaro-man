# Saguaro Man

##Raspberry Pi project

###Video Recorder

- Records slow motion black and white video

##Setup

###Desktop Icons

[How To](http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/desktop-shortcuts)

Create symbolic links

```
ls -s ~/saguaro-man/desktop/name-of-file.desktop ~/Desktop/name-of-file.desktop
```

###Auto Start & Disable Screen Saver

[How To](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=163316)

```
vim ~/.config/lxsession/LXDE-pi/autostart
```

Update to:

```
#@xscreensaver -no-splash # comment this line out to disable screensaver
@xset s off
@xset -dpms
@xset s noblank
@/home/pi/saguaro-man/startup
```

###Remove Bloatware

[How To One](http://raspi.tv/2016/how-to-free-up-some-space-on-your-raspbian-sd-card-remove-wolfram-libreoffice)

[How To Two](https://project.altservice.com/issues/418)

```
sudo apt-get remove --purge wolfram-engine libreoffice* penguinspuzzle
sudo apt-get autoremove
sudo apt-get clean
rm -rf /home/pi/python_games
```

###Update NodeJS