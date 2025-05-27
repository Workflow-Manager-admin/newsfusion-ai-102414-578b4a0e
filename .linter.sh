#!/bin/bash
cd /home/kavia/workspace/code-generation/newsfusion-ai-102414-578b4a0e/newsfusion_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

