const mongoose = require('mongoose')
const User = require('./User')

const albumSchema = new mongoose.Schema(
  {
    artist: { 
      type: String, 
      required: [true, 'Artist name is required'],
      minlength: [3, 'Min 3 characters'],
      maxlength: [50, 'Max 50 characters'] 
    },
    title: { 
      type: String, 
      required: [true, 'Album title required'],
      minlength: [3, 'Min 3 characters'],
      maxlength: [50, 'Max 50 characters']
    },
    year: { 
      type: Number, 
      required: [true, 'Release year required'],
      min: [1900, 'Must be 1900 or over'],
      max: [new Date().getFullYear(), 'Release year cannot be from the future']
    },
    genre: { 
      type: String, 
      required: [true, 'Genre required'],
      enum: {
        values: ['Pop', 'Jazz Rock', 'Jazz', 'Djent', 'Deathcore', 'Death Metal'],
        message: '{VALUE} is not accepted genre'
      }
    },
    tracks: { 
      type: Number, 
      required: [true, 'Number of tracks required'],
      min: [1, 'The albu must have tracks'],
      max: [100, 'Cannot be over 100 tracks, thats not an album anymore']
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }
  }
)
albumSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
}
)

module.exports = mongoose.model('Album', albumSchema)