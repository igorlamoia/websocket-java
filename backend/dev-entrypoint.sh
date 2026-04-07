#!/bin/sh
set -eu

compile_project() {
  ./mvnw -q -DskipTests compile test-compile
}

watch_sources() {
  while inotifywait -qq -r -e modify,create,delete,move --exclude '(^|/)(target|\.git|\.idea)/' src; do
    echo "Detected backend source change. Recompiling..."
    compile_project
  done
}

compile_project
watch_sources &
WATCHER_PID=$!

cleanup() {
  kill "$WATCHER_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

exec ./mvnw spring-boot:run
