import Muter, {captured} from 'muter';
import {expect} from 'chai';
import Gulpstream from '../src/gulpstream';

describe('Testing Gulpstream', function() {

  const muter = Muter(console, 'log');

  it(`Class Gulpstream says 'Hello!'`, captured(muter, function() {
    new Gulpstream();
    expect(muter.getLogs()).to.equal('Hello!\n');
  }));

});
