# Saguaro Man
##Raspberry Pi project
###Video Recorder

- Records slow motion black and white video

##Setup
###Desktop Icons
[How To](http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/desktop-shortcuts)
##Auto Start
[How To](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=163316)
```
~/.config/lxsession/LXDE-pi/autostart
#@xscreensaver -no-splash # comment this line out to disable screensaver
@xset s off
@xset -dpms
@xset s noblank
@/home/pi/saguaro-man/startup
```
Create symbolic link in
```
ls -s ~/saguaro-man/desktop/name-of-file.desktop ~/Desktop/name-of-file.desktop
###Remove Bloatware
[How To](http://raspi.tv/2016/how-to-free-up-some-space-on-your-raspbian-sd-card-remove-wolfram-libreoffice)
```
sudo apt-get purge wolfram-engine
sudo apt-get clean
sudo apt-get autoremove
sudo apt-get remove --purge libreoffice*
sudo apt-get clean
sudo apt-get autoremove
```
####or
[How To](https://project.altservice.com/issues/418)
```
sudo apt-get remove --purge wolfram-engine penguinspuzzle scratch dillo squeak-vm squeak-plugins-scratch sonic-pi idle idle3 netsurf-gtk netsurf-common
sudo apt-get autoremove
sudo apt-get clean
rm -rf /home/pi/python_games
sudo rm -rf /opt/vc
```
###Disable Screen Saver

