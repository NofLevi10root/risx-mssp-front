 
 function SingularToPlural(word) {
  if (!word ) {
    return  'SingularToPlural error - Undefined';
}


  // If the word ends in "y", change "y" to "ies"
  if (word.endsWith('y')) {
      return word.slice(0, -1) + 'ies';
  }
  // If the word ends in "s", "x", "z", "ch", or "sh", add "es"
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || 
      word.endsWith('ch') || word.endsWith('sh')) {
      return word + 'es';
  }
  // For words ending in "o", add "es" (common rule but can have exceptions)
  if (word.endsWith('o')) {
      return word + 'es';
  }
  // For most other cases, just add "s"
  return word + 's';
}

export {SingularToPlural};