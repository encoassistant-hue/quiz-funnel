import assert from 'node:assert/strict';
import test from 'node:test';
import { getQuizContent } from './quizData';

test('returns localized brand metadata for English', () => {
  const content = getQuizContent('en-US');

  assert.equal(content.brand.productName, 'OrthoBelt');
  assert.deepEqual(content.brand.productNameParts, ['Ortho', 'Belt']);
});

test('returns localized brand metadata for German', () => {
  const content = getQuizContent('de-DE');

  assert.equal(content.brand.productName, 'Orthogürtel');
  assert.deepEqual(content.brand.productNameParts, ['Ortho', 'gürtel']);
});

test('exposes localized product name parts for UI wordmarks', () => {
  const englishBrand = getQuizContent('en-US').brand;
  const germanBrand = getQuizContent('de-DE').brand;

  assert.equal(englishBrand.productNameParts[1], 'Belt');
  assert.equal(germanBrand.productNameParts[1], 'gürtel');
});

test('uses localized q6 back-brace labels', () => {
  const englishBackBrace = getQuizContent('en-US').questions
    .find((question) => question.id === 'q6')
    ?.options.find((option) => option.value === 'back-brace');
  const germanBackBrace = getQuizContent('de-DE').questions
    .find((question) => question.id === 'q6')
    ?.options.find((option) => option.value === 'back-brace');

  assert.equal(englishBackBrace?.label, 'Back brace or OrthoBelt');
  assert.equal(germanBackBrace?.label, 'Rückenbandage oder Orthogürtel');
});

test('uses localized product names in landing testimonials', () => {
  const englishTestimonial = getQuizContent('en-US').landing.testimonialQuote;
  const germanTestimonial = getQuizContent('de-DE').landing.testimonialQuote;

  assert.match(englishTestimonial, /OrthoBelt/);
  assert.match(germanTestimonial, /Orthogürtel/);
  assert.doesNotMatch(germanTestimonial, /OrthoBelt/);
});

test('uses localized product names in education conclusions', () => {
  const englishConclusion = getQuizContent('en-US').education.conclusion;
  const germanConclusion = getQuizContent('de-DE').education.conclusion;

  assert.match(englishConclusion, /OrthoBelt/);
  assert.match(germanConclusion, /Orthogürtel/);
});
