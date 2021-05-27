BEGIN TRANSACTION;

INSERT into users (name, hash) values ('peko', '$2a$08$UuznIpPHINhxDo29itXsbOQv/K1Zi5htectCIxcIwykHP0o.zyoFS');
INSERT into users (name, hash) values ('marine', '$2a$08$y8vUxlC1t.jM51qfB.OqdehtT707qJkGihqRd1yz6Fp28o4sDQb7G');

COMMIT;