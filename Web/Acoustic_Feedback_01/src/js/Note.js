import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
let that

class Note {
  constructor (midiNotes) {
  this.midiNotes = midiNotes;
  this.NoteFlag // playing or note
  this.envelope = new P5.Envelope()
  this.envelope.setADSR(0.01, 0.1, 0.1, 0.1) // quick decay
  this.envelope.setRange(1.0, 0.0)
  this.oscillator = new P5.Oscillator('sine')
  this.oscillator.amp(this.envelope) // set amplitude
  this.oscillators[i].freq(600)// set frequency
  this.oscillators[i].start() // start oscillating
  }PrettierPrettier

  trigger () {
    // Connect to a device by passing the service UUID
    this.myBLE.connect(this.serviceUuid, this.gotCharacteristics)
  }


}
export default Note
