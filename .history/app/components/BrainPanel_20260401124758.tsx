        <div ref={chatEndRef} />
        {isThinking && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "rgba(247,247,245,0.82)", border: `1px solid ${C.borderSub}` , borderRadius: 12, width: "fit-content" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
          </div>
        )}
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
