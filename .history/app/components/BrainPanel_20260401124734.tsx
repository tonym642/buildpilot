        <div ref={chatEndRef} />
        ))}
        {isThinking && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "rgba(247,247,245,0.82)", border: `1px solid ${C.borderSub}` , borderRadius: 12, width: "fit-content" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={chatEndRef} />
        <div style={{
          display: "flex",
          gap: isMobile ? 6 : 10,
          alignItems: "flex-end",
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${C.border}`,
          borderRadius: isMobile ? 15 : 18,
          padding: isMobile ? "7px 6px 7px 10px" : "10px 12px",
          boxShadow: isMobile ? "0 2px 12px rgba(0,0,0,0.03)" : "0 8px 30px rgba(0,0,0,0.04)",
          width: "100%"
        }}>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
            placeholder="Think out loud..."
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",

      </div>
    </div>
              outline: "none",
              color: C.text,
              fontSize: isMobile ? 17 : 13,
              fontFamily: C.font,
              resize: "none",
              lineHeight: 1.7,
              maxHeight: isMobile ? 140 : 96,
              minHeight: isMobile ? 44 : 0,
              padding: 0,
              WebkitTapHighlightColor: "transparent"
            }}
            inputMode={isMobile ? "text" : undefined}
            autoCorrect={isMobile ? "on" : undefined}
            autoCapitalize={isMobile ? "sentences" : undefined}
            spellCheck={isMobile}
          />
          <button
            onClick={() => sendMessage(inputVal)}
            disabled={isThinking || !inputVal.trim()}
            style={{
              background: inputVal.trim() && !isThinking ? C.accent : "#d8d6cf",
              border: "none",
              borderRadius: isMobile ? 15 : 12,
              padding: isMobile ? "12px 16px" : "8px 16px",
              color: "#fff",
              fontSize: isMobile ? 17 : 14,
              fontFamily: C.font,
              cursor: isThinking ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: 1,
              flexShrink: 0,
              minWidth: isMobile ? 48 : undefined,
              minHeight: isMobile ? 48 : undefined,
              marginLeft: isMobile ? 2 : 0,
              boxShadow: isMobile ? "0 1px 4px rgba(0,0,0,0.03)" : undefined,
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.15s ease"
            }}
          >
            →
          </button>
        </div>
