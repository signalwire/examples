const TOKEN = '<Insert Token Here>';
import { useState } from 'react';
import { SafeAreaView, Button } from 'react-native';
import { Video } from '@signalwire-community/react-native';

function App() {
  const [roomSession, setRoomSession] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [settings, setSettings] = useState({
    audioMuted: false,
    videoMuted: false,
  });

  return (
    <SafeAreaView>
      <Video
        logLevel="silent"
        token={TOKEN}
        onRoomReady={(roomSession) => setRoomSession(roomSession)}
        onRoomJoined={(details) => {
          setMemberId(details.member_id);
        }}
        onMemberUpdated={(details) => {
          if (details.member.id === memberId) {
            console.log('Your settings were updated', details.member);
            const settings = {
              audioMuted: details.member.audio_muted ?? settings.audioMuted,
              videoMuted: details.member.video_muted ?? settings.videoMuted,
            };
            setSettings(settings);
          }
        }}
      />
      <Button
        onPress={(e) => {
          roomSession?.leave();
        }}
        title="Leave!"
        color="red"
      />
      <Button
        onPress={(e) => {
          settings.audioMuted
            ? roomSession?.audioUnmute()
            : roomSession?.audioMute();
        }}
        title={settings.audioMuted ? 'Unmute Audio' : 'Mute Audio'}
        color={settings.audioMuted ? 'red' : 'green'}
      />
      <Button
        onPress={(e) => {
          settings.videoMuted
            ? roomSession?.videoUnmute()
            : roomSession?.videoMute();
        }}
        title={settings.videoMuted ? 'Unmute Video' : 'Mute Video'}
        color={settings.videoMuted ? 'red' : 'green'}
      />
    </SafeAreaView>
  );
}

export default App;
