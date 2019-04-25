CREATE TYPE video_type AS ENUM ('intro', 'workout', 'trigger');
ALTER TABLE videos ADD column video_type video_type;
ALTER TABLE videos ADD column position int;


INSERT INTO videos (male_video_uri, name, video_type, male_thumbnail_uri, position, female_video_uri, female_thumbnail_uri) values ('https://bogus-video.mp4', 'Trigger session workout 1', 'trigger', 'https://bogus-video.jpg', 1, 'https://bogus-video.mp4', 'https://bogus-video.jpg');
INSERT INTO videos (male_video_uri, name, video_type, male_thumbnail_uri, position, female_video_uri, female_thumbnail_uri) values ('https://bogus-video.mp4', 'Trigger session workout 1', 'trigger', 'https://bogus-video.jpg', 2, 'https://bogus-video.mp4', 'https://bogus-video.jpg');
INSERT INTO videos (male_video_uri, name, video_type, male_thumbnail_uri, position, female_video_uri, female_thumbnail_uri) values ('https://bogus-video.mp4', 'Trigger session workout 1', 'trigger', 'https://bogus-video.jpg', 3, 'https://bogus-video.mp4', 'https://bogus-video.jpg');
