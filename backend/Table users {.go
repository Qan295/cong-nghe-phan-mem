Table users {
  id int [pk, increment]
  username varchar
  email varchar [unique]
  password_hash varchar
  role varchar // visitor, admin
  preferred_language varchar
  created_at timestamp
}

Table heritage_sites {
  id int [pk, increment]
  name varchar
  description text
  location varchar
  image_url varchar
}

Table artifacts {
  id int [pk, increment]
  site_id int [ref: > heritage_sites.id]
  name varchar
  historical_period varchar
  detailed_description text
}

Table beacons {
  id int [pk, increment]
  uuid varchar
  major int
  minor int
  artifact_id int [ref: - artifacts.id]
  status varchar
}

Table media_resources {
  id int [pk, increment]
  artifact_id int [ref: > artifacts.id]
  media_type varchar // image, video, audio
  file_url varchar
  language_code varchar // vi, en
}

Table visitor_interactions {
  id int [pk, increment]
  user_id int [ref: > users.id]
  artifact_id int [ref: > artifacts.id]
  interaction_type varchar // viewed, favorited, rated
  rating_score int
  feedback_comment text
  timestamp timestamp
}
