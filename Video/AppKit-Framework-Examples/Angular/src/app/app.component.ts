import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import '@signalwire/app-kit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('videoComponent', { static: true }) videoComponent: ElementRef;
  title = 'angular-project';
  ngOnInit(): void {
    this.videoComponent.nativeElement.setupRoomSession = (rs) => {
      console.log('Setting up Room Session');

      rs.on('room.joined', (e) => {
        console.log('Joined room:', e.room_session.name);
        rs.videoMute();
      });
    };
  }
}
