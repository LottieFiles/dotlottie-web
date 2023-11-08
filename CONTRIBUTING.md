# Contributing

Thank you for your interest in contributing to the dotlottie-web monorepo! This document provides guidelines for contributing to help maintain our standards for code quality and to manage releases effectively.

## Table of Contents

* [Introduction](#introduction)
* [Prerequisites](#prerequisites)
* [Code Contributions](#code-contributions)
* [Versioning Policy](#versioning-policy)
* [Using Changesets](#using-changesets)
  * [Steps to Add a Changeset](#steps-to-add-a-changeset)
* [Pull Requests](#pull-requests)

## Introduction

We're thrilled that you're interested in contributing to our project. Your work helps us build a better product and community.

## Prerequisites

Before you contribute, please ensure you are familiar with:

* JavaScript and Node.js programming.
* Our coding standards and practices.
* The project's architecture and existing codebase.

## Code Contributions

Your code contributions are essential to the project. Please adhere to the following guidelines:

* Adhere to the existing coding standards.
* Ensure your code passes lint checks.
* Write tests to cover new functionalities.
* Update documentation to reflect your changes.

## Versioning Policy

We follow [Semantic Versioning (SemVer)](https://semver.org/):

* **Major Version X (x.y.z | x > 0)**: Incompatible API changes.
* **Minor Version Y (x.y.z | y > 0)**: Add functionality in a backward-compatible manner.
* **Patch Version Z (x.y.z | z > 0)**: Backward-compatible bug fixes.

Please consider the versioning policy when preparing your changes and specify the intended version change in your pull request.

## Using Changesets

Changesets help us manage the changelog and versions:

### Steps to Add a Changeset

1. Run `pnpm changelog`.
2. Select a version bump.
3. Document your changes in the created `.md` file.
4. Commit and push your changes and changeset.
5. Create a pull request against the `main` branch.

## Pull Requests

Ensure your pull request:

* Clearly describes the changes and motivation.
* Links to related issues.
* Passes all CI checks.

Our team will review your contribution and guide you through the process.
