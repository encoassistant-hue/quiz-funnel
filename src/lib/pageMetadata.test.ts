import assert from 'node:assert/strict';
import test from 'node:test';
import { getQuizMetadata, sharedMetadata } from './pageMetadata';

test('returns shared fallback metadata without product branding', () => {
  assert.equal(sharedMetadata.title, 'Back Pain Quiz');
  assert.equal(
    sharedMetadata.description,
    'Take the free 60-second quiz to learn whether SI joint dysfunction may be contributing to your back pain.',
  );
  assert.doesNotMatch(String(sharedMetadata.title), /OrthoBelt|Orthogürtel/);
  assert.doesNotMatch(String(sharedMetadata.description), /OrthoBelt|Orthogürtel/);
});

test('returns localized metadata for English routes', () => {
  const metadata = getQuizMetadata('en-US');

  assert.equal(
    metadata.title,
    'OrthoBelt — Find Out If the SI Joint Is Causing Your Back Pain',
  );
  assert.match(String(metadata.description), /OrthoBelt/);
});

test('returns localized metadata for German routes', () => {
  const metadata = getQuizMetadata('de-DE');

  assert.equal(
    metadata.title,
    'Orthogürtel — Finden Sie heraus, ob das ISG Ihre Rückenschmerzen verursacht',
  );
  assert.equal(
    metadata.description,
    'Machen Sie das kostenlose 60-Sekunden-Quiz, um die Ursache Ihrer Rückenschmerzen zu entdecken und einen exklusiven Rabatt auf Orthogürtel freizuschalten.',
  );
  assert.doesNotMatch(String(metadata.title), /Find Out If the SI Joint Is Causing Your Back Pain/);
  assert.doesNotMatch(String(metadata.description), /OrthoBelt|Take the free 60-second quiz/);
});
