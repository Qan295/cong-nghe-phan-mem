
Enum user_role {
  visitor
  admin
}

Enum beacon_status {
  active
  inactive
}

Enum media_type {
  image
  video
  audio
}

Enum interaction_type {
  viewed
  favorited
  rated
}

Table users {
  id int [pk, increment]
  username varchar(50) [not null]
  email varchar(100) [not null, unique]
  password_hash varchar(255) [not null]
  role user_role [default: 'visitor']
  preferred_language varchar(10) [default: 'vi']
  created_at timestamp [default: `now()`]
}

Table heritage_sites {
  id int [pk, increment]
  name varchar(255) [not null]
  description text
  location varchar(255)
  image_url varchar(255)
}

Table artifacts {
  id int [pk, increment]
  site_id int [not null, ref: > heritage_sites.id]
  name varchar(255) [not null]
  historical_period varchar(100)
  detailed_description text
}

Table beacons {
  id int [pk, increment]
  uuid varchar(100) [not null, unique]
  major int [not null]
  minor int [not null]
  artifact_id int [unique, ref: > artifacts.id]
  status beacon_status [default: 'active']
}

Table media_resources {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  media_type media_type [not null]
  file_url varchar(255) [not null]
  language_code varchar(10) [default: 'vi']
}

Table visitor_interactions {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  artifact_id int [not null, ref: > artifacts.id]
  interaction_type interaction_type [not null]
  rating_score int
  feedback_comment text
  created_at timestamp [default: `now()`]
}
