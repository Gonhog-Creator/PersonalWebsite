export default function CompressionAlgorithms() {
  return (
    <section className="w-full text-center text-gray-400 space-y-12 py-12">
      <div>
        <h2 className="!text-2xl !font-semibold text-white !mb-4">
          How compression works
        </h2>
        <p className="text-sm leading-relaxed">
          Image formats shrink files by exploiting two kinds of redundancy:{' '}
          <strong className="text-white">statistical redundancy</strong> (some
          values appear more often than others) and{' '}
          <strong className="text-white">spatial redundancy</strong> (nearby
          pixels tend to look alike). Lossless methods preserve every pixel;
          lossy methods discard information our eyes are less likely to miss.
        </p>
      </div>

      {/* Huffman coding */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Huffman coding</h3>
        <p className="text-sm leading-relaxed">
          Huffman coding replaces each symbol with a variable-length code.
          Symbols that appear frequently get short codes; rare symbols get
          longer ones. The codes form a prefix-free tree, so decoding is
          unambiguous.
        </p>

        <div className="flex justify-center overflow-x-auto pt-8">
          <svg
            viewBox="0 0 520 300"
            className="w-full max-w-[520px] h-auto"
            aria-label="Huffman tree for symbols A, B, C, D, E, F"
          >
            {/* Lines */}
            <g stroke="#475569" strokeWidth="2" fill="none">
              {/* root to A */}
              <line x1="260" y1="40" x2="140" y2="90" />
              {/* root to CBFED */}
              <line x1="260" y1="40" x2="380" y2="90" />
              {/* CBFED to CB */}
              <line x1="380" y1="90" x2="320" y2="140" />
              {/* CBFED to FED */}
              <line x1="380" y1="90" x2="440" y2="140" />
              {/* CB to C */}
              <line x1="320" y1="140" x2="290" y2="190" />
              {/* CB to B */}
              <line x1="320" y1="140" x2="350" y2="190" />
              {/* FED to FE */}
              <line x1="440" y1="140" x2="410" y2="190" />
              {/* FED to D */}
              <line x1="440" y1="140" x2="470" y2="190" />
              {/* FE to F */}
              <line x1="410" y1="190" x2="395" y2="240" />
              {/* FE to E */}
              <line x1="410" y1="190" x2="425" y2="240" />
            </g>

            {/* Branch labels */}
            <g fill="#94a3b8" fontSize="12" fontFamily="monospace">
              <text x="190" y="60">0</text>
              <text x="320" y="60">1</text>
              <text x="345" y="110">0</text>
              <text x="410" y="110">1</text>
              <text x="300" y="160">0</text>
              <text x="330" y="160">1</text>
              <text x="420" y="160">0</text>
              <text x="450" y="160">1</text>
              <text x="400" y="210">0</text>
              <text x="415" y="210">1</text>
            </g>

            {/* Nodes */}
            <g>
              <circle cx="260" cy="40" r="22" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="260" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">100</text>

              <circle cx="140" cy="90" r="22" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="140" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">A</text>
              <text x="140" y="125" textAnchor="middle" fill="#94a3b8" fontSize="11">45</text>
              <text x="140" y="140" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">0</text>

              <circle cx="380" cy="90" r="22" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="380" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">55</text>

              <circle cx="320" cy="140" r="22" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="320" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">25</text>

              <circle cx="440" cy="140" r="22" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="440" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">30</text>

              <circle cx="290" cy="190" r="20" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="290" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">C</text>
              <text x="290" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">12</text>
              <text x="290" y="235" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">100</text>

              <circle cx="350" cy="190" r="20" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="350" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">B</text>
              <text x="350" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">13</text>
              <text x="350" y="235" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">101</text>

              <circle cx="410" cy="190" r="20" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="410" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">14</text>

              <circle cx="470" cy="190" r="20" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="470" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">D</text>
              <text x="470" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">16</text>
              <text x="470" y="235" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">111</text>

              <circle cx="395" cy="240" r="18" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="395" y="244" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">F</text>
              <text x="395" y="265" textAnchor="middle" fill="#94a3b8" fontSize="10">5</text>
              <text x="395" y="278" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">1100</text>

              <circle cx="425" cy="240" r="18" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
              <text x="425" y="244" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">E</text>
              <text x="425" y="265" textAnchor="middle" fill="#94a3b8" fontSize="10">9</text>
              <text x="425" y="278" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">1101</text>
            </g>
          </svg>
        </div>

        <div className="font-mono text-xs text-gray-300 space-y-3 flex flex-col items-center pt-8">
          <div className="text-gray-500">
            Example pixel strip using the color codes above
          </div>
          <div className="text-gray-400">
            A=#FF0000 B=#00FF00 C=#0000FF D=#FFFF00 E=#FF00FF F=#00FFFF
          </div>
          <div className="h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl text-center w-full">
            <div>
              <span className="text-gray-500">Original color codes</span>
              <p className="text-gray-300 mt-1 break-all">
                #FF0000 #FF0000 #00FF00 #FF0000 #0000FF #FF0000 #FFFF00 #FF0000 #FF00FF #FF0000 #00FFFF #FF0000
              </p>
              <p className="text-gray-500 mt-1">12 colors × 24 bits = 288 bits</p>
            </div>
            <div>
              <span className="text-gray-500">Huffman encoded</span>
              <p className="text-gray-300 mt-1 break-all">
                0 0 101 0 100 0 111 0 1101 0 1100 0
              </p>
              <p className="text-gray-500 mt-1">24 bits total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other algorithms */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Run-length encoding</h3>
          <p className="text-sm leading-relaxed">
            RLE compresses runs of identical values into a count and a value. It
            works well for large flat areas, which is why it is common in fax
            images and simple graphics.
          </p>
          <div className="font-mono text-xs text-gray-300 flex items-center justify-center gap-3">
            <span className="inline-flex gap-0.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="w-3 h-3 rounded-sm bg-gray-800" />
              <span className="w-3 h-3 rounded-sm bg-gray-800" />
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
            </span>
            <span className="text-gray-500">→</span>
            <span>3B, 2W, 1B</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">LZ77 / DEFLATE</h3>
          <p className="text-sm leading-relaxed">
            LZ77 builds a sliding dictionary of recently seen data and replaces
            repeated sequences with back-references. DEFLATE pairs LZ77 with
            Huffman coding to compress both the literals and the offsets.
          </p>
          <div className="font-mono text-xs text-gray-300 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-gray-500">A 4×4 image with repeating stripes</span>
              <div className="inline-flex flex-col gap-0.5">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="flex gap-0.5">
                    <span className="w-4 h-4 rounded-sm bg-blue-500" />
                    <span className="w-4 h-4 rounded-sm bg-blue-500" />
                    <span className="w-4 h-4 rounded-sm bg-gray-800" />
                    <span className="w-4 h-4 rounded-sm bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-left">
              <span className="text-gray-500">Byte stream (after filtering):</span>
              <p className="text-gray-300 mt-1">
                00 00 01 01 00 00 01 01 00 00 01 01 00 00 01 01
              </p>
            </div>
            <div className="text-left">
              <span className="text-gray-500">LZ77 output:</span>
              <p className="text-gray-300 mt-1">
                00 00 01 01 <span className="text-blue-400">[back 4, length 12]</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Arithmetic coding</h3>
          <p className="text-sm leading-relaxed">
            Instead of assigning whole-bit codes, arithmetic coding represents a
            stream of symbols as a single fractional number in a narrowed
            interval. It can approach the theoretical compression limit more
            closely than Huffman coding.
          </p>
          <div className="font-mono text-xs text-gray-300 space-y-2 text-left">
            <div>
              <span className="text-gray-500">Input:</span>
              <p className="text-gray-300 mt-1">AAB (A = 60%, B = 40%)</p>
            </div>
            <div>
              <span className="text-gray-500">Interval narrowing:</span>
              <p className="text-gray-300 mt-1">
                [0, 1) → A [0, 0.6) → A [0, 0.36) → B [0.216, 0.36)
              </p>
            </div>
            <div>
              <span className="text-gray-500">Output:</span>
              <p className="text-gray-300 mt-1">
                any number in <span className="text-blue-400">[0.216, 0.36)</span>, e.g. 0.25
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">DCT & quantization</h3>
          <p className="text-sm leading-relaxed">
            JPEG splits the image into 8×8 blocks and applies the Discrete Cosine
            Transform. The result is a set of frequency coefficients. High-frequency
            coefficients are quantized, which is where the loss happens, and the
            surviving values are zig-zag scanned and Huffman encoded.
          </p>
          <div className="font-mono text-xs text-gray-300 space-y-2 text-left">
            <div>
              <span className="text-gray-500">2×2 pixel block:</span>
              <p className="text-gray-300 mt-1">
                10 12<br />
                12 14
              </p>
            </div>
            <div>
              <span className="text-gray-500">DCT coefficients:</span>
              <p className="text-gray-300 mt-1">
                48  -4<br />
                -4   0
              </p>
            </div>
            <div>
              <span className="text-gray-500">After quantization:</span>
              <p className="text-gray-300 mt-1">
                3  0<br />
                0  0
              </p>
            </div>
            <div>
              <span className="text-gray-500">Zig-zag scan:</span>
              <p className="text-gray-300 mt-1">
                [3, 0, 0, 0] → Huffman
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formats summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">How the formats use these ideas</h3>
        <ul className="space-y-4 text-sm text-gray-400">
          <li className="flex flex-col items-center gap-1">
            <span className="text-white font-medium">PNG</span>
            <span>
              Lossless: filters each row, then compresses the filtered data
              with DEFLATE (LZ77 + Huffman).
            </span>
          </li>
          <li className="flex flex-col items-center gap-1">
            <span className="text-white font-medium">JPEG</span>
            <span>
              Lossy: color subsampling, DCT, quantization, zig-zag scan, then
              Huffman coding of the coefficients.
            </span>
          </li>
          <li className="flex flex-col items-center gap-1">
            <span className="text-white font-medium">WebP</span>
            <span>
              Lossy: VP8 uses block prediction and transform coding, similar in
              spirit to JPEG but with better prediction and entropy coding.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
