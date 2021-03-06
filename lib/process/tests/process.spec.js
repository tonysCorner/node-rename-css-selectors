'use strict';

const rcsProcess = require('../process');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('process/process', () => {
    beforeEach(() => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should process css files', done => {
        rcsProcess('**/style*.css', {
            collectSelectors: true,
            newPath: testCwd,
            cwd: fixturesCwd
        }, (err, data) => {
            let newFile       = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
            let newFile2      = fs.readFileSync(testCwd + '/css/style2.css', 'utf8');
            let newFile3      = fs.readFileSync(testCwd + '/css/subdirectory/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync(resultsCwd + '/css/style2.css', 'utf8');
            let expectedFile3 = fs.readFileSync(resultsCwd + '/css/subdirectory/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);
            expect(newFile3).to.equal(expectedFile3);

            done();
        });
    });

    it('should process css files as arrays', done => {
        rcsProcess(['**/style.css', '**/style2.css'], {
            collectSelectors: true,
            newPath: testCwd,
            cwd: fixturesCwd
        }, (err, data) => {
            let newFile       = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
            let newFile2      = fs.readFileSync(testCwd + '/css/style2.css', 'utf8');
            let newFile3      = fs.readFileSync(testCwd + '/css/subdirectory/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync(resultsCwd + '/css/style2.css', 'utf8');
            let expectedFile3 = fs.readFileSync(resultsCwd + '/css/subdirectory/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);
            expect(newFile3).to.equal(expectedFile3);

            done();
        });
    });

    it('should process css files and flatten the directories', done => {
        rcsProcess('**/style*.css', {
            collectSelectors: true,
            flatten: true,
            newPath: testCwd,
            cwd: fixturesCwd
        }, (err, data) => {
            let newFile       = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
            let newFile2      = fs.readFileSync(testCwd + '/css/style2.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync(resultsCwd + '/css/style2.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);

            done();
        });
    });

    it('should not overwrite original files', done => {
        rcsProcess(['**/style.css', '**/style2.css'], {
            collectSelectors: true,
            newPath: fixturesCwd,
            cwd: fixturesCwd
        }, err => {
            expect(err.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

            done();
        });
    });

    it('should fail', done => {
        rcsProcess('path/**/with/nothing/in/it', err => {
            expect(err).to.be.an('object');
            expect(err.error).to.equal('ENOENT');

            done();
        });
    });
});
