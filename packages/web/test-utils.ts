/**
 * Copyright 2023 Design Barn Inc.
 */

export const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
